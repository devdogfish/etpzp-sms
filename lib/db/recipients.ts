"use server";

import db from ".";
import { getSession } from "../auth/sessions";

export async function fetchRecipients() {
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
      `SELECT DISTINCT ON (r.phone)
            r.id AS recipient_id,
            r.phone AS phone,
            COALESCE(c.name, 'Unknown') AS contact_name,
            COALESCE(c.id, 0) AS contact_id,
            COALESCE(c.description, '') AS contact_description,
            CASE 
                WHEN c.id IS NOT NULL THEN 'contact'
                ELSE 'message'
            END AS source
        FROM 
            recipient r
        LEFT JOIN 
            message m ON r.message_id = m.id
        LEFT JOIN 
            contact c ON r.contact_id = c.id
        WHERE 
            m.user_id = $1 -- For recipients from messages
            OR c.user_id = $1 -- For recipients from contacts
        ORDER BY 
          r.phone, 
          CASE WHEN c.id IS NOT NULL THEN 0 ELSE 1 END, -- Prioritize entries with contact info
      r.id DESC;`, // For consistent results, order by the most recent recipient entry
      [userId]
    );
    return { success: true, data: result.rows };
  } catch (error) {
    return {
      success: false,
      message: "Error occurred. Failed to fetch recipients.",
    };
  }
}
