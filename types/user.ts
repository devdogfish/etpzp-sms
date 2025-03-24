export const validSettingNames = [
  "lang",
  "display_name",
  "profile_color_id",

  "primary_color_id",
  "appearance_layout",
  "dark_mode",
];

export const appearanceLayoutValues = ["MODERN", "SIMPLE"] as const; // this is needed for zod
export type LayoutType = (typeof appearanceLayoutValues)[number];
export type UserSettings = {
  lang: string;

  profile_color_id: number;
  display_name: string;

  dark_mode: boolean;
  primary_color_id: number;
  appearance_layout: LayoutType;
};

export type User = {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
};

// All user fields
export type DBUser = User &
  UserSettings & {
    role: "USER" | "ADMIN";
    created_at?: Date;
    updated_at?: Date;
  };

export type SettingName =
  | "lang"
  | "profile_color_id"
  | "display_name"
  | "primary_color_id"
  | "appearance_layout"
  | "dark_mode";
