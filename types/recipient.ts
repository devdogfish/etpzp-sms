// this is the normal recipient that we use in the new message form.
export type NewRecipient = {
  phone: string;
  error?: { type: "error" | "warning" | undefined; message?: string };
  formattedPhone?: string;

  // if it is a contact
  contactId?: string;
  contactName?: string;
  contactDescription?: string;
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

// No joins - normal query directly from the DB
export type DBRecipient = {
  id: number;
  phone: string;
};
