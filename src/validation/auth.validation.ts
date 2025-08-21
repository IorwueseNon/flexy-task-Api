import {z} from 'zod';

export const emailSchema = z.email("Invalid email format").trim().min(1, "Email is required").max(255, "Email must be less than 255 characters");
export const passwordSchema = z.string().min(6, "Password must be at least 6 characters long").max(50, "Password must be less than 255 characters");

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(225, "Name must be less than 50 characters"),
    email:emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
})

export const loginSchema = z.object({
     email:emailSchema ,
     password: passwordSchema,
})
