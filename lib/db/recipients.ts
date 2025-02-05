"use server";

import db from ".";
import { getSession } from "../auth/sessions";
import { DBContactRecipient } from "@/types/recipient";

export async function fetchRecipients(): Promise<
  (DBContactRecipient & { last_used: Date })[] | undefined
> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT 
          r.id,
          r.phone,
          m.created_at AS last_used,
          c.id AS contact_id,
          c.name AS contact_name,
          c.description AS contact_description
        FROM 
          recipient r
        JOIN 
          message m ON r.message_id = m.id
        LEFT JOIN 
          contact c ON r.contact_id = c.id
        WHERE 
          m.user_id = $1
        ORDER BY 
          r.index,
          m.created_at DESC;
      `,
      [userId]
    );

    return result.rows as [DBContactRecipient & { last_used: Date }];
  } catch (error) {}
}
