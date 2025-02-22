"use server";

import { DBContact } from "@/types/contact";
import db from ".";
import { getSession } from "../auth/sessions";

export async function fetchContacts() {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT * FROM contact 
        WHERE user_id = $1
      `,
      [userId]
    );

    return result.rows as DBContact[];
  } catch (error) {}
}
