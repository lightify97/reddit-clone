import {
  Button,
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
import { CrossCircledIcon } from '@modulz/radix-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CircleCheck, CircleX, Lock, Message2 } from 'tabler-icons-react';
import { useForgotPasswordMutation, useLoginMutation } from '../../../graphql/generated/graphql';
import { customLoader } from '../../../util/customLoader';
import { emailSchema, loginFormSchema } from '../../../util/zodSchemas';
import useStyles from './Login.styles';

const LoginForm: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [{ fetching: logginIn }, login] = useLoginMutation();
  const { classes } = useStyles();
  const [{ fetching: sendingEmail }, forgotPassword] = useForgotPasswordMutation();
  // const { user, setUser } = useContext(State);

  const loginForm = useForm({
    schema: loginFormSchema,
    initialValues: {
      email: '',
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

  const submitLoginHandler = async (values: any) => {
    cleanNotifications();
    const response = await login(values);
    if (response.data?.login?.errors) {
      let errors = response.data.login.errors;
      errors.forEach((error) => {
        showNotification({
          id: 'error',
          autoClose: false,
          title: error?.field,
          message: error?.message,
          color: 'red',
          radius: 'md',
          icon: <CrossCircledIcon />,
          className: 'error-notification',
          style: { backgroundColor: 'dark' },
          sx: { backgroundColor: 'dark' },
        });
      });
    } else if (response.data?.login?.user) {
      if (typeof router.query.next === 'string') router.push(router.query.next);
      else router.push('/');
    }
  };

  return (
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
        </form>
        {sendingEmail && (
          <LoadingOverlay
            loaderProps={{ size: 'xl' }}
            loader={customLoader}
            overlayOpacity={0.9}
            overlayColor="#333333"
            visible
          />
        )}
      </Modal>
      <Title className={classes.title} align="center">
        <Text inherit variant="gradient" component="span">
          Reedit Login
        </Text>
      </Title>
      <form onSubmit={loginForm.onSubmit(submitLoginHandler)} style={{ fontFamily: 'Inter' }}>
        <TextInput
          size="md"
          icon={
            <ThemeIcon variant="light" color="primary" size={24}>
              <Message2 />
            </ThemeIcon>
          }
          required
          label="Email"
          placeholder="your@email.com"
          {...loginForm.getInputProps('email')}
          mb={10}
        />

        <PasswordInput
          size="md"
          icon={
            <ThemeIcon variant="light" color="primary" size={24}>
              <Lock />
            </ThemeIcon>
          }
          label="Password"
          placeholder="Password"
          required
          {...loginForm.getInputProps('password')}
        />

        <Group mt="md">
          <Button fullWidth variant="gradient" type="submit">
            Login
          </Button>
          <Link href={'/register'} passHref>
            <Button onClick={() => cleanNotifications()} fullWidth variant="outline" color="cyan">
              New Here! Sign Up
            </Button>
          </Link>
          <Button
            loading={sendingEmail}
            loaderPosition="left"
            fullWidth
            variant="subtle"
            color="red"
            onClick={() => showEmailModal()}
          >
            Forgot Password
          </Button>
        </Group>
        {logginIn && (
          <LoadingOverlay
            loaderProps={{ size: 'xl' }}
            loader={customLoader}
            overlayOpacity={0.9}
            overlayColor="#333333"
            visible
          />
        )}
      </form>
    </Paper>
  );
};

export default LoginForm;
