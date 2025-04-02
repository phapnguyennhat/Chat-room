import { z } from "zod";

export const keyWordSchema = z.object({
   keyword: z.string({message: 'Email Or Name is required'}).min(3, 'At least 3 characters ').max(30, 'Maximum 30 characters')
})

