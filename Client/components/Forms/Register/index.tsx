import { Box, Button, Checkbox, Group, LoadingOverlay, PasswordInput, Space, Text, TextInput, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { CrossCircledIcon } from '@modulz/radix-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { z } from 'zod';
import { useRegisterMutation } from '../../../graphql/generated/graphql';
import useStyles from './Register.styles';


interface registerProps {

}

const schema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
    termsOfService: z.boolean(),
    username: z.string().min(3).max(24),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
})


const RegisterForm: React.FC<registerProps> = ({ }) => {
    const router = useRouter();
    const [{ fetching }, register] = useRegisterMutation();
    const { classes } = useStyles();
    const form = useForm({
        schema: zodResolver(schema),
        initialValues: {
            email: '',
            termsOfService: false,
            username: '',
            password: ''
        }
    });

    const submitHandler = async (values) => {
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
            })
        }
        else if (response.data?.registerUser.user) {
            let user = response.data.registerUser.user;
            router.push('/');
        }

    }

    return (
        <Box>
            <Title className={classes.title} align="center">
                {/* Welcome to{' '} */}
                <Text inherit variant="gradient" component="span">
                    Reddit Signup
                </Text>
            </Title>
            <Space h={50} />
            <form onSubmit={form.onSubmit(submitHandler)}>
                <TextInput
                    required
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                />

                <TextInput
                    required
                    label="Username"
                    placeholder="Username"
                    {...form.getInputProps('username')}
                />

                <PasswordInput
                    label="Password"
                    placeholder="Password"
                    required
                    {...form.getInputProps('password')}
                />

                <Checkbox
                    mt="md"
                    label="I agree to privacy terms"
                    required
                    {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                />

                <Group mt="md">
                    <Button fullWidth variant='gradient' type="submit">Register</Button>
                    <Link href={'/login'} passHref>
                        <Button onClick={(e) => cleanNotifications()} fullWidth variant='outline' color='cyan'>Already Registered! Go to Login</Button>
                    </Link>
                </Group>
                {fetching &&
                    <LoadingOverlay loaderProps={{ size: 'xl', color: 'blue', variant: 'bars' }}
                        overlayOpacity={0.9}
                        overlayColor="#333333" visible />
                }
            </form>
        </Box>
    );
}

export default RegisterForm;