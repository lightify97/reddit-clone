import { Box, Center, Grid } from '@mantine/core';
import React from 'react'
import LoginForm from '../components/Forms/Login';
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql'

const Login: React.FC<{}> = ({ }) => {
    return (
        <Box pt='6%' >
            <Center  >
                <LoginForm />
            </Center>
        </Box>
    );
}

export default withUrqlClient(createUrqlClient)(Login);