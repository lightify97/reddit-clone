import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { CrossCircledIcon } from '@modulz/radix-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { z } from 'zod';
import { User } from '../../../context/User';
import { useLoginMutation } from '../../../graphql/generated/graphql';
import useStyles from './Login.styles';

const schema = z.object({
  email: z.string().email({ message: 'Invalid Email' }),
  password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
});

const LoginForm: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [{ fetching }, login] = useLoginMutation();
  const { classes } = useStyles();
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const submitHandler = async (values: any) => {
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
      let user = response.data.login.user;
      router.push('/');
    }
  };

  return (
    <Box>
      <Title className={classes.title} align="center">
        {/* Welcome to{' '} */}
        <Text inherit variant="gradient" component="span">
          Reedit Login
        </Text>
      </Title>
      <form onSubmit={form.onSubmit(submitHandler)} style={{ fontFamily: 'Inter' }}>
        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Password"
          required
          {...form.getInputProps('password')}
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
  );
};

export default LoginForm;
