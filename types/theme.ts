import { themes } from "@/lib/theme.colors";

export type ThemeProperties = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  radius: string;
};

export type Theme = {
  light: ThemeProperties;
  dark: ThemeProperties;
};

export type Themes = {
  [key: string]: Theme;
};

export type ThemeColorStateParams = {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
};

export type ThemeColors = keyof typeof themes; // This will be 'Orange' | 'Blue' | 'Green' | 'Rose' | 'Zinc'
