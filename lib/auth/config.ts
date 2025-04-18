import { User } from "@/types/user";
import { SessionOptions } from "iron-session";

export type SessionData = {
  user?: User;
  isAuthenticated: boolean;
  isAdmin: boolean;
};
export type Login = {
  email: string;
  password: string;
};
export const defaultSession: SessionData = {
  isAuthenticated: false,
  isAdmin: false,
};

// Iron session config object
export const sessionOptions: SessionOptions = {
  cookieName: "my-etpzp-app-session", // anything you want
  password: process.env.SESSION_SECRET!, // TypeScript non-null assertion operator

  // Optional fields
  ttl: 60 * 60 * 24, // cookie expiration from now in seconds (we want 24h)
  cookieOptions: {
    // prevent client side js from accessing the cookie
    httpOnly: true,
    // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
    secure: process.env.NODE_ENV === "production",
  },
};

export const activeDirectoryConfig = {
  url: process.env.AD_URL!,
  baseDN: process.env.AD_BASE_DN!,
  username: process.env.AD_EMAIL!, // we store emails in the username field
  password: process.env.AD_PASSWORD!,
};
