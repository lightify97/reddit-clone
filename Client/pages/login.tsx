import { Box, Center, Grid } from '@mantine/core';
import React from 'react'
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import LoginForm from '../components/Forms/Login';


const Register: React.FC<{}> = ({ }) => {
    return (
        <Box style={{
            width: '100vw', height: '98vh',
        }}>
            <Center  >
                <LoginForm />
            </Center>
            <ColorSchemeToggle />
        </Box>
    );
}

export default Register;