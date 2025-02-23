// this is the normal recipient that we use in the new message form.
export type NewRecipient = {
  phone: string;
  error?: { type: "error" | "warning" | undefined; message?: string };
  formattedPhone?: string;

  // if it is a contact
  contact?: {
    id: string;
    name?: string;
    phone: string;
    description?: string;
  };
};

// Processed recipient - once it ran through the function
export type RecipientWithContact = {
  id: string;
  phone: string;

  contact?: {
    id: string;
    name?: string;
    phone: string;
    description?: string;
  };
};

// No joins - normal query directly from the DB
export type DBRecipient = {
  id: string;
  phone: string;
};
