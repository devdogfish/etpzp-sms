import { NewRecipient } from "./recipient";

export type MessageLocation = "sent" | "draft" | "trash";
export type StatusEnums = "SENT" | "SCHEDULED" | "FAILED" | "DRAFTED";
export type LocationEnums = "ALL" | "SENT" | "DRAFT" | "TRASH";

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
  updated_at: Date;
  status: StatusEnums;
  location: "SENT" | "DRAFT" | "TRASH"; // not LocationEnums because in the db location can not be `ALL`
  scheduled_time: Date | null;
  failure_reason: string | null;
};

export type AmountIndicators =
  | {
      sent: string;
      drafts: string;
      trash: string;
      all: string;
    }
  | undefined;
