export type UserSettings = {
  lang: string;

  profile_color_id: number;
  display_name: string;

  dark_mode: boolean;
  primary_color_id: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
};

// All user fields
export type DBUser = User & UserSettings & {
  role: "USER" | "ADMIN";
  created_at?: Date;
  updated_at?: Date;
};

export type SettingName =
  | "lang"
  | "profile_color_id"
  | "display_name"
  | "dark_mode"
  | "primary_color_id";
