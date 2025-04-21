"use server";

import ActiveDirectory from "activedirectory2";
import { activeDirectoryConfig, SessionData } from "@/lib/auth/config";
import userExists from "./user";
import userInGroup from "./group";
import saveUser, { dummySaveUser } from "@/lib/actions/user.actions";
import type { DBUser } from "@/types/user";

export default async function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<SessionData & { errors: string[] }> {
  const ad = new ActiveDirectory(activeDirectoryConfig);

  // 1. Check if user even exists in the active directory server
  const exists = await userExists(ad, email, password);
  if (!exists.success) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      errors: [exists.error ? exists.error : ""],
    };
  }
  // 2. Check if user is allowed to use the app
  const userGroup = "Utilizadores-SMS";
  const hasAppPermission = await userInGroup(ad, email, userGroup);

  // 3. Check if user has admin privileges
  const adminGroup = "Administradores-SMS";
  const hasAdminPermission = await userInGroup(ad, email, adminGroup);

  // 4. Sync all of this with the database
  const userResult = await saveUser(ad, email, hasAdminPermission.success);

  return {
    user: userResult.success ? userResult.data : undefined,
    isAuthenticated: hasAppPermission.success,
    isAdmin: hasAdminPermission.success,
    errors: [
      exists.error !== null
        ? exists.error
        : "An error occurred while checking if user exists",
      hasAppPermission.error !== null
        ? hasAppPermission.error
        : "An error occurred while checking if user is allowed to use the app",
      hasAdminPermission.error !== null
        ? hasAdminPermission.error
        : "An error occurred while checking if user is an admin",
    ],
  };
}

export async function dummyAuthenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<SessionData> {
  const dummyUser: SessionData & { user: DBUser } = {
    user: {
      id: "1",
      email: "dummy@user.com",
      name: "Dummy User",
      first_name: "Dummy",
      last_name: "User",
      role: "ADMIN",

      lang: "pt",

      profile_color_id: 1,
      display_name: "Dummy User",

      primary_color_id: 1,
      dark_mode: false,
      appearance_layout: "MODERN",
    },
    isAuthenticated: true,
    isAdmin: true,
  };
  const userResult = await dummySaveUser(dummyUser.user as DBUser);

  return {
    user: userResult.success ? userResult.data : undefined,
    isAuthenticated: userResult.success,
    isAdmin: userResult.success,
  };
}
