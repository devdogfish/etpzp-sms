export type DBContact = {
  id: string;
  phone: string;

  // contact information
  user_id: string;
  name: string;
  description?: string; // Optional field
  created_at: Date;
  updated_at: Date;
};
