import { zodResolver } from '@mantine/form';
import { z } from 'zod';

export const loginFormSchema = zodResolver(
  z.object({
    email: z.string().email({ message: 'Invalid Email' }),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
  })
);

export const emailSchema = zodResolver(
  z.object({
    email: z.string().email({ message: 'Invalid Email' }),
  })
);

export const passwordSchema = zodResolver(
  z.object({
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
  })
);

export const registerFormSchema = zodResolver(
  z.object({
    email: z.string().email({ message: 'Invalid Email' }),
    termsOfService: z.boolean(),
    username: z.string().min(3).max(24),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
  })
);
