"use server";

import { SettingName, User } from "@/types";
import db from "../db";
import ActiveDirectory from "activedirectory2";
import { z } from "zod";
import { updateSettingSchema, validSettingNames } from "../form.schemas";
import {
  ActionResponse,
  DataActionResponse,
  UpdateSettingResponse,
} from "@/types/action";
import { getSession } from "../auth/sessions";
import { cookies } from "next/headers";

// These are guaranteed properties when you find the user using A.D.
type userResult = {
  displayName: string; // display name

  givenName: string; // first name
  sn: string; // surname

  cn: string; // full name
};

export default async function fetchUser(
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
      console.log("User already exists in db. Authentication successful!");

      return {
        success: true,
        message: ["Authentication successful!", "User already exists"],
        data: selectResult.rows[0],
      };
    } else {
      console.log("Trying to create new user in DB.");

      return new Promise((resolve) => {
        ad.findUser(email, async (err, user: any) => {
          if (err || !user) {
            console.log("ERROR: " + JSON.stringify(err));
            resolve({ success: false, message: ["User not found."] });
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

export async function dummyFetchUser(
  user: User
): Promise<DataActionResponse<User>> {
  try {
    const selectResult = await db(
      "SELECT * FROM public.user WHERE email = $1;",
      [user.email]
    );
    if (selectResult.rows.length) {
      console.log(
        "User already exists in db. Dummy-Authentication successful!"
      );

      return {
        success: true,
        message: ["Authentication successful!", "User already exists"],
        data: selectResult.rows[0],
      };
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
    return {
      success: false,
      message: ["Error occurred", "Failed to create or fetch user."],
    };
  }
}

// export async function updateSetting(formData: FormData) {
export async function updateSetting(
  formData: FormData
): Promise<UpdateSettingResponse> {
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
      error: "Invalid setting value",
      input: rawData.value,
    };
  }
  try {
    if (!userId) throw new Error("Invalid user id.");
    // Try to validate and parse the raw data.
    const parsedData = updateSettingSchema.parse(rawData);
    console.log(`Updating database ${parsedData.name} setting`);

    // If validation passed, you can proceed to update the database accordingly.
    console.log(
      `Updating database ${parsedData.name} with value:`,
      parsedData.value
    );

    const { rows } = await db(
      `UPDATE public.user SET ${parsedData.name} = $2 WHERE id = $1 RETURNING lang, profile_color_id, display_name, dark_mode, primary_color_id;`,
      [userId, parsedData.value]
    );

    // Update the settings cookie
    const cookieStore = await cookies();
    cookieStore.set("my-settings", JSON.stringify(rows[0]));

    return {
      success: true,
      input: rawData.value,
      data: rows[0][rawData.name],
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
