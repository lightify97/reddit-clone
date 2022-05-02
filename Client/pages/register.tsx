import { Box, Center, Grid } from '@mantine/core';
import React from 'react'
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import RegisterForm from '../components/Forms/Register';


const Register: React.FC<{}> = ({ }) => {
    return (
        <Box pt={'6%'} style={{
            width: '100vw', height: '98vh',
        }}>
            <Center  >
                <RegisterForm />
            </Center>
            <ColorSchemeToggle />
        </Box>
    );
}

export default Register;