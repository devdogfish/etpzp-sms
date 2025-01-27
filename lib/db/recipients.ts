// import { ActionResponse } from '@/types/action';
"use server";

import { ActionResult, SuccessResult } from "@/types/action";
import db from ".";
import { getSession } from "../auth/sessions";
import { ActionResponse } from "@/types/contact";
import { DBContactRecipient } from "@/types/recipient";

export async function fetchRecipients(): Promise<
  ActionResult<[DBContactRecipient & { last_used: Date }]>
> {
  const session = await getSession();
  const userId = parseInt(session.user?.id ? session?.user?.id : "");
  if (userId && isNaN(userId)) {
    return {
      success: false,
      message: "Invalid user id.",
    };
  }

  try {
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
          m.created_at DESC
      `,
      [userId]
    );

    return {
      success: true,
      message: "",
      data: result.rows as [DBContactRecipient & { last_used: Date }],
    };
  } catch (error) {
    return {
      success: false,
      message: "Error occurred. Failed to fetch recipients.",
    };
  }
}
