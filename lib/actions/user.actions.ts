"use server";

import type { DBUser, SettingName, User } from "@/types/user";
import db from "../db";
import ActiveDirectory from "activedirectory2";
import { z } from "zod";
import { UpdateSettingSchema } from "../form.schemas";
import { DataActionResponse } from "@/types/action";
import { getSession } from "../auth/sessions";
import { validSettingNames } from "@/types/user";

// These are guaranteed properties when you find the user using A.D.
type userResult = {
  displayName: string; // display name

  givenName: string; // first name
  sn: string; // surname

  cn: string; // full name
};

export default async function saveUser(
  ad: ActiveDirectory,
  email: string,
  isAdmin: boolean
): Promise<DataActionResponse<User>> {
  try {
    const selectResult = await db(
      "SELECT * FROM public.user WHERE email = $1;",
      [email]
    );
    if (selectResult.rows.length) {
      return {
        success: true,
        message: ["Authentication successful!", "User already exists"],
        data: selectResult.rows[0],
      };
    } else {
      // User has never signed up before

      return new Promise((resolve) => {
        ad.findUser(email, async (err, user: any) => {
          if (err || !user) {
            resolve({ success: false, message: ["User not found."] });
            return;
          }

          const { cn, displayName, givenName, sn } = user;
          try {
            const insertResult = await db(
              "INSERT INTO public.user (email, name, role, first_name, last_name, display_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
              [
                email, // email
                cn, // complete name
                isAdmin ? "ADMIN" : "USER",
                givenName, // first name
                sn, // surname
                displayName,
              ]
            );

            resolve({
              success: true,
              message: ["Authentication successful!", "New user created"],
              data: insertResult.rows[0],
            });
          } catch (error) {
            resolve({
              success: false,
              message: ["Error occurred", "Failed to create user in database."],
            });
          }
        });
      });
    }
  } catch (error) {
    return {
      success: false,
      message: ["Error occurred", "Failed to create or fetch user."],
    };
  }
}

export async function dummySaveUser(
  user: DBUser
): Promise<DataActionResponse<User>> {
  try {
    const selectResult = await db(
      "SELECT * FROM public.user WHERE email = $1;",
      [user.email]
    );
    if (selectResult.rows.length) {
      return {
        success: true,
        message: ["Authentication successful!", "User already exists"],
        data: selectResult.rows[0],
      };
    } else {
      // User has never signed up before
      try {
        const insertResult = await db(
          "INSERT INTO public.user (email, name, role, first_name, last_name, display_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, first_name, last_name;",
          [
            user.email,
            user.name,
            user.role,
            user.first_name,
            user.last_name,
            `${user.first_name} ${user.last_name}`,
          ]
        );

        return {
          success: true,
          message: ["Authentication successful!", "New user created"],
          data: insertResult.rows[0],
        };
      } catch (error) {
        return {
          success: false,
          message: ["Error occurred", "Failed to create user in database."],
        };
      }
    }
  } catch (error) {
    console.log("Dummy save user error:", error);

    return {
      success: false,
      message: ["Error occurred", "Failed to create or fetch user."],
    };
  }
}

// Settings page calls this function to update one setting at a time
export async function updateSetting(formData: FormData) {
  const session = await getSession();
  const userId = session?.user?.id;

  // Extract raw data from the form
  const rawData = {
    name: formData.get("name") as SettingName,
    value: formData.get("value") as string,
  };

  if (!validSettingNames.includes(rawData.name)) {
    return {
      success: false,
      error: "Invalid setting",
      input: rawData.value,
    };
  }
  try {
    if (!userId) throw new Error("Invalid user id.");
    // Try to validate and parse the raw data.
    const parsedData = UpdateSettingSchema.parse(rawData);

    // If validation passed, you can proceed to update the database accordingly.
    const { rows } = await db(
      `UPDATE public.user SET ${parsedData.name} = $2, updated_at = NOW() WHERE id = $1 RETURNING *;`,
      [userId, parsedData.value]
    );

    return {
      success: true,
      input: rawData.value,
      data: rows[0][parsedData.name],
    };
  } catch (error) {
    // If the error is produced by zod, extract and send back the error details.
    if (error instanceof z.ZodError) {
      const { fieldErrors } = error.flatten();

      // One option: join all errors from all fields
      const errorString = Object.values(fieldErrors)
        .flat()
        .filter(Boolean)
        .join(", ");
      return {
        success: false,
        error: errorString,
        input: rawData.value,
      };
    }

    // For any other kind of error, return a generic error message.
    return {
      success: false,
      input: rawData.value,
      error: "Something went wrong while saving this input",
    };
  }
}
