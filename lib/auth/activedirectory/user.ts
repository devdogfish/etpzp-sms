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
          resolve({ success: false, error: err });
        } else {
          resolve({ success: authenticated, error: null });
        }
      }
    );
  });
}
