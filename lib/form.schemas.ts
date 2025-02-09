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
  phone: z
    .string()
    .max(50, { message: "Email must be less than 50 characters long." })
    .refine(
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

export const validSettingNames = [
  "lang",
  "profile_color_id",
  "display_name",
  "dark_mode",
  "primary_color_id",
];
// Create a schema that handles each setting separately
export const UpdateSettingSchema = z.discriminatedUnion("name", [
  // For the language setting (“lang”) we expect a 2‑character string (ISO 639‑1 code)
  z.object({
    name: z.literal("lang"),
    value: z
      .string()
      .min(2, "Language code must be exactly 2 characters")
      .max(2, "Language code must be exactly 2 characters"),
  }),
  // For profile_color_id, convert the incoming string to a number and require an integer.
  z.object({
    name: z.literal("profile_color_id"),
    value: z.preprocess(
      (val) => Number(val),
      z
        .number({
          invalid_type_error: "Profile color id must be a number",
        })
        .int("Profile color id must be an integer")
    ),
  }),
  // For primary_color_id, use similar logic as profile_color_id.
  z.object({
    name: z.literal("primary_color_id"),
    value: z.preprocess(
      (val) => Number(val),
      z
        .number({
          invalid_type_error: "Primary color id must be a number",
        })
        .int("Primary color id must be an integer")
    ),
  }),
  // For display_name, require a non-empty string with a max length of 50 characters.
  z.object({
    name: z.literal("display_name"),
    value: z
      .string()
      .nonempty("Display name cannot be empty")
      .max(50, "Display name cannot exceed 50 characters"),
  }),
  // For dark_mode, convert the string "true"/"false" to a boolean.
  z.object({
    name: z.literal("dark_mode"),
    value: z.preprocess((val) => {
      console.log("parsing bool from string. current value:", val);
      
      // Convert strings "true" and "false" to actual booleans.
      if (val === "dark") return true;
      if (val === "light") return false;
      return val;
    }, z.boolean({ invalid_type_error: "Dark mode must be a boolean value" })),
  }),
]);
