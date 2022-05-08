import {
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
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
import React from 'react';
import { Lock, Message2, UserSearch } from 'tabler-icons-react';
import { useRegisterMutation } from '../../../graphql/generated/graphql';
import { registerFormSchema } from '../../../util/zodSchemas';
import useStyles from './Register.styles';

const RegisterForm: React.FC<{}> = () => {
  const router = useRouter();
  const [{ fetching }, register] = useRegisterMutation();
  const { classes } = useStyles();
  const registerForm = useForm({
    schema: registerFormSchema,
    initialValues: {
      email: '',
      termsOfService: false,
      username: '',
      password: '',
    },
  });

  const submitHandler = async (values: any) => {
    cleanNotifications();
    const response = await register(values);
    if (response.data?.registerUser.errors) {
      let errors = response.data.registerUser.errors;
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
    } else if (response.data?.registerUser.user) {
      router.push('/');
    }
  };

  return (
    <Paper shadow="xl" radius="lg" p={'2%'} withBorder>
      <Box>
        <Title className={classes.title} align="center">
          <Text inherit variant="gradient" component="span">
            Reedit Signup
          </Text>
        </Title>
        {/* <Space h={50} /> */}
        <form onSubmit={registerForm.onSubmit(submitHandler)}>
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
            {...registerForm.getInputProps('email')}
            mb={10}
          />

          <TextInput
            size="md"
            icon={
              <ThemeIcon variant="light" color="primary" size={24}>
                <UserSearch />
              </ThemeIcon>
            }
            required
            label="Username"
            placeholder="Username"
            {...registerForm.getInputProps('username')}
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
            {...registerForm.getInputProps('password')}
            mb={10}
          />

          <Checkbox
            mt="md"
            label="I agree to privacy terms"
            required
            {...registerForm.getInputProps('termsOfService', { type: 'checkbox' })}
          />

          <Group mt="md">
            <Button fullWidth variant="gradient" type="submit">
              <Text variant="text" component="span">
                Register
              </Text>
            </Button>
            <Link href={'/login'} passHref>
              <Button onClick={() => cleanNotifications()} fullWidth variant="outline" color="cyan">
                <Text variant="gradient" component="span">
                  Already Registered! Go to Login
                </Text>
              </Button>
            </Link>
          </Group>
          {fetching && (
            <LoadingOverlay
              loaderProps={{ size: 'xl', color: 'blue', variant: 'bars' }}
              overlayOpacity={0.9}
              overlayColor="#333333"
              visible
            />
          )}
        </form>
      </Box>
    </Paper>
  );
};

export default RegisterForm;
