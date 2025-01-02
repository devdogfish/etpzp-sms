import { User } from "@/types";
import { SessionOptions } from "iron-session";

export interface SessionData {
  user: User;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const defaultSession: SessionData = {
  user: {
    id: "1000",
    name: "Me Yin",
    email: "yin@tin.ca",
    username: "Test user",
    role: "user",
  },
  isAuthenticated: true,
  isAdmin: false,
};

export const emptyUser: User = {
  id: "",
  name: "",
  email: "",
  username: "",
};

export const sessionOptions: SessionOptions = {
  cookieName: "my-app-session", // anything you want
  password: process.env.SESSION_SECRET!, // TypeScript non-null assertion operator
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
  username: process.env.AD_USERNAME!,
  password: process.env.AD_PASSWORD!,
};
