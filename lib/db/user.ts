import { User } from "@/types";
import db from ".";

export default async function fetchUser(
  email: string
): Promise<ActionResult<User>> {
  try {
    const selectResult = await db(
      "SELECT * FROM public.user WHERE email = $1;",
      [email]
    );
    if (selectResult.rows.length) {
      console.log("User already exists in db. Authentication successful!");
      
      return { success: true, data: selectResult.rows[0] };
    } else {
      const insertResult = await db(
        "INSERT INTO public.user (email, name) VALUES ($1, $2) RETURNING *;",
        [email, email]
      );
      console.log("New user created in db. Authentication successful!");
      return { success: true, data: insertResult.rows[0] };
    }
  } catch (error) {
    return {
      success: false,
      error: { message: "Failed to create or fetch user.", code: "DB_ERROR" },
    };
  }
}
