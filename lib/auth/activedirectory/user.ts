"use server";
import type ActiveDirectory from "activedirectory2";

// Check if user even exists on the server
export default async function userExists(
  ad: ActiveDirectory,
  username: string,
  password: string
): Promise<{ success: boolean; error: string | null }> {
  return new Promise((resolve) => {
    ad.authenticate(
      username,
      password,
      (err: string | null, authenticated: boolean) => {
        if (err || !authenticated) {
          console.log("Error during authentication: " + err);
          resolve({ success: false, error: err });
        } else {
          console.log(`Authenticated successfully!`);
          resolve({ success: authenticated, error: null });
        }
      }
    );
  });
}
