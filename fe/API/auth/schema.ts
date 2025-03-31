import { z } from "zod";

export const loginSchema = z.object({
    account: z.string({message: 'Account is required'}).min(1, 'Account is required'),
    password: z.string({message: 'Password is required'}).min(8, 'Password must be at least 8 characters long'),
})

export type LoginData = z.infer<typeof loginSchema>;