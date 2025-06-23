import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  full_name: z.string().min(1, { message: "Full name is required" }),
  profile_picture: z.string().url().optional(),
  bio: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), 
});

export const schemas = {
  signUpSchema,
  loginSchema,
};