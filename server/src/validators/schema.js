import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), 
  full_name: z.string().min(1),
  profile_picture: z.string().url(),
  bio: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), 
});

export const schemas = {
  signUpSchema,
  loginSchema,
};