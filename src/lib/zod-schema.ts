import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string().min(1, 'username is required'),
	password: z.string().min(1, 'Password is required').max(32, 'Password is too long')
});

export const registerSchema = loginSchema;

export type LoginSchema = z.infer<typeof loginSchema>;
