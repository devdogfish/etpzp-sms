export type MessageLocation = "sent" | "draft" | "trash";

export type User = {
  id: string;
  name: string;
  display_name: string;
  first_name: string;
  last_name: string;

  email: string;
  role?: "user" | "admin";
  created_at?: Date;
  updated_at?: Date;
};

export type Message = {
  id: string;
  sender: string;
  recipients: Recipient[];
  subject: string;
  body: string;
};
export type DBMessage = {
  id: string;
  user_id: string;
  subject: string;
  body: string;
  created_at: Date;
  updated_at: Date;
  status: "sent" | "scheduled" | "failed" | null; // this can be null when the message is a draft
  location: "sent" | "draft" | "trash" | null;
  scheduled_time?: Date;
  failure_reason?: string;
};

export type Recipient = {
  id: string;
  contactId?: string;
  contactName?: string;
  phone: string;
  error?: { type: "error" | "warning"; message: string };
};

export type Contact = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  description?: string; // Optional field
  // full contact:
  created_at?: Date;
  updated_at?: Date;
};
