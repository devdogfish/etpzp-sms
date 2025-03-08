type BaseRecipient = {
  phone: string;
  // if it is a contact
  contact?: {
    id: string;
    name?: string;
    phone: string;
    description?: string;
  };
};

// Recipients used in the new message form.
export type NewRecipient = {
  formattedPhone?: string;
  isValid: boolean;
  error?: {
    type?: "error" | "warning";
    message?: string;
  };
} & BaseRecipient;

export type WithContact = {
  id: string;
} & BaseRecipient;

// No joins - normal query directly from the DB
export type DBRecipient = {
  id: string;
  phone: string;
};

export type FetchedRecipient = DBRecipient & { last_used: Date };
export type RankedRecipient = DBRecipient & { usageCount: number };
