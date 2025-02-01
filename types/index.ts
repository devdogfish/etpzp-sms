import { DBRecipient, NewRecipient } from "./recipient";

export type StatusEnums = "SENT" | "SCHEDULED" | "FAILED" | "DRAFTED";
export type CategoryEnums = "SENT" | "SCHEDULED" | "FAILED" | "DRAFT" | "TRASH";

export type StringBoolMap = { [key: string]: boolean };

export type User = {
  id: string;
  name: string;
  display_name: string;
  first_name: string;
  last_name: string;
  color_id: number;

  email: string;
  role: "USER" | "ADMIN";
  created_at?: Date;
  updated_at?: Date;
};

export type Message = {
  // new Message
  id?: string;
  sender: string;
  recipients: NewRecipient[];
  subject: string;
  body: string;
  sendDelay: number;
};

export type DBMessage = {
  id: string;
  user_id: string;
  subject: string | null;
  body: string;
  created_at: Date;
  send_time: Date;
  status: StatusEnums;
  in_trash: boolean;
  failure_reason: string | null;
  recipients: DBRecipient[];
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
