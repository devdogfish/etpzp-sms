export type Contact = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  description?: string; // Optional field
  created_at: Date;
  updated_at: Date;
};

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof Contact]?: string[];
  };
  inputs?: {
    [K in keyof Contact]?: string;
  };
};
