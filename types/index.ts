import { z } from "zod";
import { DBRecipient, NewRecipient } from "./recipient";
import { MessageSchema } from "@/lib/form.schemas";

export type StatusEnums = "SENT" | "SCHEDULED" | "FAILED" | "DRAFTED";
export type CategoryEnums =
  | "SENT"
  | "SCHEDULED"
  | "FAILED"
  | "DRAFTS"
  | "TRASH";

export type StringBoolMap = { [key: string]: boolean };
export type Modals = {
  schedule: boolean;
  scheduleAlert: boolean;
  contact: {
    create: boolean;
    edit: boolean;
    info: boolean;
    insert: boolean;
  };
};

export type Message = z.infer<typeof MessageSchema> & {
  recipients: NewRecipient[];
};

export type DBMessage = {
  id: string;
  user_id: string;
  sender?: string;
  subject?: string | null;
  body: string;
  created_at: Date;
  send_time: Date;
  status: StatusEnums;
  in_trash: boolean;
  api_error_code: number | null;
  api_error_details_json: string | null;
  recipients: DBRecipient[];
  sms_reference_id: string;
};

export type AmountIndicators = {
  sent: number;
  scheduled: number;
  failed: number;
  drafts: number;
  trash: number;
  contacts: number;
};
