"use server";

import { SettingName, User } from "@/types";
import db from "../db";
import ActiveDirectory from "activedirectory2";
import { z } from "zod";
import { updateSettingSchema, validSettingNames } from "../form.schemas";

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

export async function updateSettingO1(formData: FormData) {
  // Extract raw data from the form
  const rawData = {
    name: formData.get("name") as SettingName,
    value: formData.get("value") as string,
  };

  const isValidName = validSettingNames.includes(rawData.name);

  if (!isValidName) {
    return {
      success: false,
      message: ["Please fix the errors in the form"],
      errors: { [rawData.name]: ["Invalid setting value"] },
      inputs: rawData,
    };
  }
  try {
    console.log(`Updating database ${rawData.name} setting`);
    // Try to validate and parse the raw data.
    const parsedData = updateSettingSchema.parse(rawData);

    // If validation passed, you can proceed to update the database accordingly.
    console.log(
      `Updating database ${parsedData.name} with value:`,
      parsedData.value
    );

    // (Insert your database update logic here.)
    return { success: true, message: ["Successfully updated setting"] };
  } catch (error) {
    // If the error is produced by zod, extract and send back the error details.
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: ["Please fix the errors in the form"],
        errors: error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    // For any other kind of error, return a generic error message.
    return {
      success: false,
      message: [`Something went wrong while updating ${rawData.name}.`],
    };
  }
}
