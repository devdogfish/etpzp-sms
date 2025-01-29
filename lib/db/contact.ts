"use server";

import db from ".";
import { getSession } from "../auth/sessions";
import { DBContact } from "@/types/contact";

export async function fetchContacts(): Promise<DBContact[] | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log(`FETCHING CONTACTS...`);
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db("SELECT * FROM contact WHERE user_id = $1", [
      userId,
    ]);

    return result.rows;
  } catch (error) {}
}
