"use server";

import ActiveDirectory from "activedirectory2";
import { activeDirectoryConfig, SessionData } from "@/lib/auth/config";
import userExists from "./user";
import userInGroup from "./group";
import fetchUser, { dummyFetchUser } from "@/lib/actions/user.actions";
import { User } from "@/types";

export default async function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<SessionData & { errors: string[] }> {
  const ad = new ActiveDirectory(activeDirectoryConfig);

  // 1. Check if user exists on in the active directory server
  const exists = await userExists(ad, email, password);
  if (!exists.success) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      errors: [exists.error ? exists.error : ""],
    };
  }
  // 2. Check if user is allowed to use the app (inside the group)
  const userGroup = "Utilizadores-SMS";
  const hasAppPermission = await userInGroup(ad, email, userGroup);

  // 3. Check if user has admin privileges (inside the group)
  const adminGroup = "Administradores-SMS";
  const hasAdminPermission = await userInGroup(ad, email, adminGroup);

  console.log(exists);
  console.log(hasAppPermission);
  console.log(hasAdminPermission);

  // Sync all of this with the database
  const userResult = await fetchUser(ad, email, hasAdminPermission.success);
  // console.log("DB SYNC ResULT");
  // console.log(userResult);

  return {
    user: userResult.success ? userResult.data : undefined,
    isAuthenticated: hasAppPermission.success,
    isAdmin: hasAdminPermission.success,
    errors: [
      exists.error !== null ? exists.error : "",
      hasAppPermission.error !== null ? hasAppPermission.error : "",
      hasAdminPermission.error !== null ? hasAdminPermission.error : "",
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
  const dummyUser: SessionData = {
    user: {
      id: "1",
      email: "pepe@gmail.com",
      name: "Pepe Maximus",
      first_name: "Pepe",
      last_name: "Maximus",
      role: "ADMIN",

      lang: "pt",

      profile_color_id: 1,
      display_name: "Pepe Maximus",

      primary_color_id: 1,
      dark_mode: false,
    },
    isAuthenticated: true,
    isAdmin: true,
  };
  const userResult = await dummyFetchUser(dummyUser.user as User);
  return {
    user: userResult.success ? userResult.data : undefined,
    isAuthenticated: userResult.success,
    isAdmin: userResult.success,
  };
}

export async function testConnection() {
  const ad = new ActiveDirectory(activeDirectoryConfig);

  ad.authenticate(
    activeDirectoryConfig.username, // what they call username is actually an email
    activeDirectoryConfig.password,
    function (err, auth) {
      if (err) {
        console.log("ERROR: " + JSON.stringify(err));
        return;
      }

      if (auth) {
        console.log("Authenticated!");
      } else {
        console.log("Authentication failed!");
      }
    }
  );
}
