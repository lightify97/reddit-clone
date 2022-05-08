import {
  Box,
  Button,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CircleCheck, CircleX, Lock, Message2 } from 'tabler-icons-react';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '../../graphql/generated/graphql';
import { createUrqlClient } from '../../util/createUrqlClient';
import { emailSchema, passwordSchema } from '../../util/zodSchemas';

const ResetPassword: NextPage<{ token: string }> = ({ token }) => {
  const [opened, setOpened] = useState(false);
  const [{ fetching: sendingEmail }, forgotPassword] = useForgotPasswordMutation();
  const [{ fetching: resettingPassword, error: errorResettingPassword }, resetPassword] =
    useResetPasswordMutation();
  const router = useRouter();

  const passwordResetForm = useForm({
    schema: passwordSchema,
    initialValues: {
      password: '',
    },
  });

  const resetForm = useForm({
    initialValues: {
      email: '',
    },
    schema: emailSchema,
  });

  const showEmailModal = async () => {
    cleanNotifications();
    setOpened(true);
  };

  const submitForgottenPassword = async (values: any) => {
    const response = await forgotPassword({ email: values.email });
    cleanNotifications();
    if (response.data?.forgotPassword) {
      setOpened(false);
      showNotification({
        id: 'forgotPasswordSuccess',
        autoClose: false,
        title: 'Email Sent',
        message: 'An email containing reset password link was sent',
        color: 'green',
        radius: 'md',
        icon: <CircleCheck />,
        className: 'success-notification',
        style: { backgroundColor: 'dark' },
        sx: { backgroundColor: 'dark' },
      });
    } else {
      showNotification({
        id: 'forgotPasswordFailed',
        autoClose: false,
        title: 'Something Went Wrong',
        message: 'Please try with your email again.',
        color: 'red',
        radius: 'md',
        icon: <CircleX />,
        className: 'failure-notification',
        style: { backgroundColor: 'dark' },
        sx: { backgroundColor: 'dark' },
      });
    }
  };
  const submitPasswordHandler = async (values: any) => {
    const response = await resetPassword({ token, password: values.password });
    cleanNotifications();
    // console.log(errorResettingPassword);
    if (response.data?.resetPassword.errors || errorResettingPassword) {
      setOpened(false);
      showNotification({
        id: 'resetPasswordFailed',
        autoClose: false,
        title: 'Something Went Wrong',
        message: 'Please try again with a new reset link',
        color: 'red',
        radius: 'md',
        icon: <CircleX />,
        className: 'failure-notification',
        style: { backgroundColor: 'dark' },
        sx: { backgroundColor: 'dark' },
      });
    } else if (response.data?.resetPassword.user) {
      router.push('/');
    }
  };

  return (
    <Box pt={'6%'}>
      <Center>
        <Paper shadow="xl" radius="lg" p={'2%'} withBorder>
          <Modal
            centered
            opened={opened}
            onClose={() => setOpened(false)}
            title={
              <Text size="xl" variant="gradient" component="span">
                Reset Password
              </Text>
            }
          >
            <form
              onSubmit={resetForm.onSubmit(submitForgottenPassword)}
              style={{ fontFamily: 'Inter' }}
            >
              <TextInput
                size="md"
                icon={
                  <ThemeIcon variant="light" color="primary" size={24}>
                    <Message2 />
                  </ThemeIcon>
                }
                required
                label="Enter your email"
                placeholder="your@email.com"
                {...resetForm.getInputProps('email')}
                mb={10}
              />

              <Group mt="md">
                <Button fullWidth variant="gradient" type="submit">
                  Reset Password
                </Button>
              </Group>
              {sendingEmail && (
                <LoadingOverlay
                  loaderProps={{ size: 'xl', color: 'red', variant: 'bars' }}
                  overlayOpacity={0.9}
                  overlayColor="#333333"
                  visible
                />
              )}
            </form>
          </Modal>
          <Title
            style={{
              fontSize: 70,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1,
              marginBottom: 20,
            }}
            align="center"
          >
            <Text inherit variant="gradient" component="span">
              Reset Password
            </Text>
          </Title>
          <form
            onSubmit={passwordResetForm.onSubmit(submitPasswordHandler)}
            style={{ fontFamily: 'Inter' }}
          >
            <PasswordInput
              size="md"
              icon={
                <ThemeIcon variant="light" color="primary" size={24}>
                  <Lock />
                </ThemeIcon>
              }
              label="New Password"
              placeholder="Password"
              required
              {...passwordResetForm.getInputProps('password')}
            />

            <Group mt="md">
              <Button fullWidth variant="gradient" type="submit">
                Set Password
              </Button>
              <Button fullWidth variant="subtle" color="red" onClick={() => showEmailModal()}>
                Send Link Again
              </Button>
            </Group>
            {resettingPassword && (
              <LoadingOverlay
                loaderProps={{ size: 'xl', color: 'blue', variant: 'bars' }}
                overlayOpacity={0.9}
                overlayColor="#333333"
                visible
              />
            )}
          </form>
        </Paper>
      </Center>
    </Box>
  );
};

ResetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ResetPassword);
