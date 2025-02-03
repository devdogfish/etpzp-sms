import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Our one source of truth is the form schema. When you create a new field, add it here.
export const MessageSchema = z.object({
  // sender: z.enum(["ETPZP", "ExampleSMS", "Test"], {
  //   message: "Sender can only be called ETPZP or ExampleSMS",
  // }),
  sender: z.string().optional(),
  // recipients are handled internally for more thorough error messages
  subject: z.string().optional(),
  body: z.string().min(1, "The message can't be empty."),
  sendDelay: z.coerce.number({ message: "Invalid schedule date" }).optional(),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(8, { message: "Email must be at least 8 characters long." })
    .max(50, { message: "Email must be less than 50 characters long." }),
  password: z.string(),
});

export const ContactSchema = z.object({
  // id: z.string(),
  name: z.string().min(2).max(50),
  phone: z.string().refine(
    // this returns a boolean telling zod whether the phone data is valid or not
    (input: string) => {
      const parsedPhone = parsePhoneNumberFromString(input);
      console.log("logging new contact from Schema file:");
      console.log(parsedPhone);

      return (parsedPhone && parsedPhone.isValid()) || false;
    },
    {
      message: "Invalid phone number.",
    }
  ),
  description: z.string().max(255).optional(),
});
