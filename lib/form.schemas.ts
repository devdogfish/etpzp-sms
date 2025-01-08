import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Message } from "@/types";

// Our one source of truth is the form schema. When you create a new field, add it here.
export const MessageSchema = z.object({
  sender: z.string(),
  recipients: z.array(
    z.object({
      id: z.string(),
      contactId: z.string().optional(),
      contactName: z.string().optional(),
      phone: z.string(),
    })
  ),
  subject: z.string(),
  body: z.string(),
});


export const LoginSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string(),
});

export const ContactSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().refine(
    (input: string) => {
      const parsedPhone = parsePhoneNumberFromString(input);
      return parsedPhone && parsedPhone.isValid();
    },
    {
      message: "Invalid phone number.",
    }
  ),
  description: z.string().max(255).optional(),
});
