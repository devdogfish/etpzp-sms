import { z } from "zod";
import { DBRecipient, NewRecipient } from "./recipient";
import { MessageSchema } from "@/lib/form.schemas";

export type StatusEnums = "SENT" | "SCHEDULED" | "FAILED" | "DRAFTED";
export type CategoryEnums = "SENT" | "SCHEDULED" | "FAILED" | "DRAFT" | "TRASH";

export type StringBoolMap = { [key: string]: boolean };

export type UserSettings = {
  lang: string;

  profile_color_id: number;
  display_name: string;

  dark_mode: boolean;
  primary_color_id: number;
};

export type User = {
  id: string;
  name: string;
  first_name: string;
  last_name: string;

  email: string;
  role: "USER" | "ADMIN";
  created_at?: Date;
  updated_at?: Date;
} & UserSettings;

export type SettingName =
  | "lang"
  | "profile_color_id"
  | "display_name"
  | "dark_mode"
  | "primary_color_id";

export type Message = z.infer<typeof MessageSchema> & {
  recipients: NewRecipient[];
};
// {
//   // new Message
//   id?: string;
//   sender: string;
//   recipients: NewRecipient[];
//   subject: string;
//   body: string;
//   sendDelay?: number;
// };

export type DBMessage = {
  id: string;
  user_id: string;
  sender?: string;
  subject?: string | null;
  body: string;
  created_at: Date;
  send_time?: Date;
  status: StatusEnums;
  in_trash: boolean;
  failure_reason?: string | null;
  recipients: DBRecipient[];
  sms_reference_id: string;
};

export type AmountIndicators =
  | {
      sent: number;
      scheduled: number;
      failed: number;
      drafted: number;
      trashed: number;
    }
  | undefined;
