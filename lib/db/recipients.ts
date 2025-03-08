"use server";

import db from ".";
import { getSession } from "../auth/sessions";
import { DBRecipient } from "@/types/recipient";

export async function fetchRecipients() {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    const { rows } = await db(
      `
        SELECT
          r.id,
          r.phone,
          m.created_at AS last_used
        FROM recipient r
        JOIN message m ON r.message_id = m.id
        WHERE m.user_id = $1;
      `,
      [userId]
    );

    return rows as (DBRecipient & { last_used: Date })[];
  } catch (error) {}
}
