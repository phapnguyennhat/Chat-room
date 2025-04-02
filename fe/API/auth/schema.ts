import { z } from "zod";

export const loginSchema = z.object({
    account: z.string({message: 'Account is required'}).min(1, 'Account is required'),
    password: z.string({message: 'Password is required'}).min(8, 'Password must be at least 8 characters long'),
})

export type LoginData = z.infer<typeof loginSchema>;




export const registerSchema = z
	.object({
		firstName: z.string().min(2, 'First Name is required').max(50),
		lastName: z.string().min(2, 'Last Name is required').max(50),
		username: z.string().min(2, 'Username is required').max(50),
		email: z.string().email(),
		password: z
			.string()
			.min(6, 'The password must be at least 6 characters long.')
			.max(50),
		confirmPassword: z
			.string()
			.min(6, 'The password must be at least 6 characters long.')
			.max(50),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Confirm password must match password',
		path: ['confirmPassword'], // Chỉ định lỗi hiển thị cho trường confirmPassword
    });
    

export type RegisterData = z.infer<typeof registerSchema>;
