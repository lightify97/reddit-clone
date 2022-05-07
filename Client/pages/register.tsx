import { Box, Center, Grid } from '@mantine/core';
import React from 'react'
import RegisterForm from '../components/Forms/Register';
import { createUrqlClient } from '../util/createUrqlClient';
import { withUrqlClient } from 'next-urql'


const Register: React.FC<{}> = ({ }) => {
    return (
        <Box pt={'6%'}>
            <Center  >
                <RegisterForm />
            </Center>
        </Box>
    );
}

export default withUrqlClient(createUrqlClient)(Register);