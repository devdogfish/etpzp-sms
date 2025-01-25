export type MessageLocation = "sent" | "draft" | "trash";
export type StatusEnums = "SENT" | "SCHEDULED" | "FAILED" | "DRAFTED";
export type LocationEnums = "ALL" | "SENT" | "DRAFT" | "TRASH";

export type DBUser = {
  id: string;
  name: string;
  display_name: string;
  first_name: string;
  last_name: string;

  email: string;
  role: "USER" | "ADMIN";
  created_at: Date;
  updated_at: Date;
};
export type User = {
  id: string;
  name: string;
  display_name: string;
  first_name: string;
  last_name: string;

  email: string;
  role: "USER" | "ADMIN";
  created_at?: Date;
  updated_at?: Date;
};

export type Message = {
  // new Message
  id?: string;
  sender: string;
  recipients: Recipient[];
  subject: string;
  body: string;
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

// this is the normal recipient that we use in the new message form.
export type Recipient = {
  id: string;
  contactId?: string;
  contactName?: string;
  phone: string;
  error?: { type: "error" | "warning"; message: string };
};
export type SuggestedRecipient = {
  recipient_id: number;
  phone: string;
  contact_description: string;
  contact_id: number;
  contact_name: string;
};

export type Contact = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
};

export type AmountIndicators =
  | {
      sent: string;
      drafts: string;
      trash: string;
      all: string;
    }
  | undefined;
