"use server";
import ActiveDirectory from "activedirectory2";
import { activeDirectoryConfig, SessionData } from "@/lib/auth.config";
import userExists from "./user";
import userInGroup from "./group";
import fetchUser from "@/lib/db/user";

export default async function authenticate({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<SessionData & { errors: string[] }> {
  const ad = new ActiveDirectory(activeDirectoryConfig);

  // 1. Check if user exists on in the active directory server
  const exists = await userExists(ad, username, password);
  if (!exists.success) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      errors: [exists.error ? exists.error : ""],
    };
  }
  // 2. Check if user is allowed to use the app (inside the group)
  const userGroup = "Utilizadores-SMS";
  const hasAppPermission = await userInGroup(ad, username, userGroup);

  // 3. Check if user has admin privileges (inside the group)
  const adminGroup = "Administradores-SMS";
  const hasAdminPermission = await userInGroup(ad, username, adminGroup);

  console.log(exists);
  console.log(hasAppPermission);
  console.log(hasAdminPermission);

  // Sync all of this with the database
  const userResult = await fetchUser(ad, username, hasAdminPermission.success);
  // console.log("DB SYNC ResULT");
  // console.log(userResult);

  // TODO fetch the db here to get more info about the user like userId and profile picture as well as user settings maybe
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
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<SessionData> {
  // if (
  //   username !== process.env.AD_USERNAME ||
  //   password !== process.env.AD_PASSWORD
  // ) {
  //   return {
  //     isAuthenticated: false,
  //     isAdmin: false,
  //   };
  // }
  return {
    user: {
      id: "1",
      email: "pepe@gmail.com",
      name: "Pepe Maximus",
      display_name: "Pepe Maximus",
      first_name: "Pepe",
      last_name: "Maximus",
      role: "admin"
    },
    isAuthenticated: true,
    isAdmin: true,
  };
}

export async function testConnection() {
  const config = {
    url: process.env.AD_URL!,
    baseDN: process.env.AD_BASE_DN!,
    username: process.env.AD_USERNAME!,
    password: process.env.AD_PASSWORD!,
  };
  const ad = new ActiveDirectory(config);

  ad.authenticate(config.username, config.password, function (err, auth) {
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return;
    }

    if (auth) {
      console.log("Authenticated!");
    } else {
      console.log("Authentication failed!");
    }
  });
}
