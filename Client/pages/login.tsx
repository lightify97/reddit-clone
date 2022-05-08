import { BackgroundImage, Box, Center, Grid } from '@mantine/core';
import React from 'react';
import LoginForm from '../components/Forms/Login';
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql';

const Login: React.FC<{}> = ({}) => {
  return (
    <BackgroundImage src="/login-bg.jpg" style={{ height: '100vh' }}>
      <Box pt="6%">
        <Center>
          <LoginForm />
        </Center>
      </Box>
    </BackgroundImage>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
