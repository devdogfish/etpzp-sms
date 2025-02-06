"use server";

import { User } from "@/types";
import db from "../db";
import ActiveDirectory from "activedirectory2";

// These are guaranteed properties when you find the user using A.D.
type userResult = {
  displayName: string; // display name

  givenName: string; // first name
  sn: string; // surname

  cn: string; // full name
};

type ActionResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export default async function fetchUser(
  ad: ActiveDirectory,
  email: string,
  isAdmin: boolean
): Promise<ActionResponse<User>> {
  try {
    const selectResult = await db(
      "SELECT * FROM public.user WHERE email = $1;",
      [email]
    );
    if (selectResult.rows.length) {
      console.log("User already exists in db. Authentication successful!");

      return { success: true, data: selectResult.rows[0] };
    } else {
      console.log("Trying to create new user in DB.");

      return new Promise((resolve) => {
        ad.findUser(email, async (err, user: any) => {
          if (err || !user) {
            console.log("ERROR: " + JSON.stringify(err));
            resolve({ success: false, message: "User not found." });
            return;
          }

          console.log("USER INFORMATION FOUND");
          const { cn, displayName, givenName, sn } = user;
          try {
            const insertResult = await db(
              "INSERT INTO public.user (email, name, role, display_name, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
              [
                email,
                cn,
                isAdmin ? "ADMIN" : "USER",
                displayName,
                givenName,
                sn,
              ]
            );

            resolve({
              success: true,
              message: "Authentication successful! New user created.",
              data: insertResult.rows[0],
            });
          } catch (error) {
            resolve({
              success: false,
              message: "Failed to create user in database.",
            });
          }
        });
      });
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to create or fetch user.",
    };
  }
}

export async function dummyFetchUser(
  user: User
): Promise<ActionResponse<User>> {
  try {
    const selectResult = await db(
      "SELECT * FROM public.user WHERE email = $1;",
      [user.email]
    );
    if (selectResult.rows.length) {
      console.log(
        "User already exists in db. Dummy-Authentication successful!"
      );

      return { success: true, data: selectResult.rows[0] };
    } else {
      console.log("Trying to create new user in DB.");

      try {
        const insertResult = await db(
          "INSERT INTO public.user (email, name, role, display_name, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
          [
            user.email,
            user.name,
            user.role,
            user.display_name,
            user.first_name,
            user.last_name,
          ]
        );

        return {
          success: true,
          message: "Authentication successful! New user created.",
          data: insertResult.rows[0],
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to create user in database.",
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to create or fetch user.",
    };
  }
}

export async function updateSettings() {
  console.log("hello");
  return { success: true, message: ["Success test"] };
}
