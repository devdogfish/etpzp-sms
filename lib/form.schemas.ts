import { z } from "zod";
import validator from "validator";

const recipientSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  phone: z.string().refine(validator.isMobilePhone),
});

// Our one source of truth is the form schema. When you create a new field, add it here.
export const NewMessageFormSchema = z.object({
  from: z.string(),
  to: z.string().email(),
  subject: z.string(),
  message: z.string(),
  contacts: z.array(recipientSchema),
});

export const AuthFormSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string(),
});


const contactSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string().min(2).max(50),
  phone: z.string().refine(validator.isMobilePhone),
  description: z.string().max(255).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});