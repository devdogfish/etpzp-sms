"use server";
import type ActiveDirectory from "activedirectory2";

// Check if user is apart of a specific group
export default async function userInGroup(
  ad: ActiveDirectory,
  username: string,
  group: string
): Promise<{ success: boolean; error: string | null }> {
  return new Promise((resolve) => {
    ad.isUserMemberOf(
      username,
      group,
      (err: object | null, isMember: boolean) => {
        if (err) {
          resolve({ success: false, error: JSON.stringify(err) });
        } else {
          resolve({ success: isMember, error: null });
        }
      }
    );
  });
}
