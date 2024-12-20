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


export const ContactSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().refine(validator.isMobilePhone, {
    message: "Invalid phone number."
  }),
  description: z.string().max(255).optional(),
});