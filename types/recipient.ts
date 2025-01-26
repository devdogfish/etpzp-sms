// this is the normal recipient that we use in the new message form.
export type NewRecipient = {
  id: string;
  contactId?: string;
  contactName?: string;
  phone: string;
  error?: { type: "error" | "warning"; message: string };
};

// Processed recipient - once it ran through the function
export type DBContactRecipient = {
  id: string;
  phone: string;

  // if it is a contact
  contact_id: string | null;
  contact_name: string | null;
  contact_description: string | null;
};

export type ProcessedDBContactRecipient = DBContactRecipient & {
  usage_count: number;
};
