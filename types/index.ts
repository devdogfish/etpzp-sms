export type MessageLocation = "sent" | "drafts" | "trash";

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
  sender: string;
  recipients: Recipient[];
  subject: string;
  body: string;
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
