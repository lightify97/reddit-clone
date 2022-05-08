import { BackgroundImage, Box, Center, Grid } from '@mantine/core';
import React from 'react';
import RegisterForm from '../components/Forms/Register';
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql';

const Register: React.FC<{}> = ({}) => {
  return (
    <BackgroundImage src="/login-bg.jpg" style={{ height: '100vh' }}>
      <Box pt={'6%'}>
        <Center>
          <RegisterForm />
        </Center>
      </Box>
    </BackgroundImage>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
