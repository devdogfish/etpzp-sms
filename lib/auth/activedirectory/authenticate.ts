"use server";
import ActiveDirectory from "activedirectory2";
import {
  activeDirectoryConfig,
  defaultSession,
  SessionData,
} from "@/lib/auth.config";
import userExists from "./user";
import userInGroup from "./group";

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

  // 2. Check if user is allowed to use the app (inside the group)
  const userGroup = "Utilizadores-SMS";
  const hasAppPermission = await userInGroup(ad, username, userGroup);

  // 3. Check if user has admin privileges (inside the group)
  const adminGroup = "Administradores-SMS";
  const hasAdminPermission = await userInGroup(ad, username, adminGroup);

  console.log(exists);
  console.log(hasAppPermission);
  console.log(hasAdminPermission);

  // TODO fetch the db here to get more info about the user like userId and profile picture as well as user settings maybe
  return {
    id: defaultSession.id,
    username: defaultSession.username,
    isAuthenticated: hasAppPermission.success && hasAppPermission.success,
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
  const session = defaultSession;
  session.username = username;
  return session;
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
