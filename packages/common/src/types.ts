import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(50),
});
