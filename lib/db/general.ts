"use server";

import { AmountIndicators } from "@/types";
import { getSession } from "../auth/sessions";
import db from ".";
import { UserSettings } from "@/types/user";

export async function fetchUserSettings() {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("fetching user settings");
  try {
    if (!userId) throw new Error("Invalid user id.");
    const { rows } = await db(
      `
      SELECT lang, profile_color_id, display_name, dark_mode, primary_color_id 
      FROM public.user WHERE id = $1;
    `,
      [userId]
    );
    return rows[0] as UserSettings;
  } catch (error) {}
}

export async function fetchAmountIndicators() {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT
            -- Count of sent messages (in the past and not in trash)
            CAST(COUNT(CASE WHEN m.send_time < NOW() AND m.in_trash = false THEN 1 END) AS INTEGER) AS sent,
            
            -- Count of scheduled messages (in the future and not in trash)
            CAST(COUNT(CASE WHEN m.status = 'SCHEDULED' AND m.in_trash = false AND m.send_time > NOW() THEN 1 END) AS INTEGER) AS scheduled,
            
            -- Count of failed messages (not in trash)
            CAST(COUNT(CASE WHEN m.status = 'FAILED' AND m.in_trash = false THEN 1 END) AS INTEGER) AS failed,
            
            -- Count of drafted messages (not in trash)
            CAST(COUNT(CASE WHEN m.status = 'DRAFTED' AND m.in_trash = false THEN 1 END) AS INTEGER) AS drafts,
            
            -- Count of messages in trash
            CAST(COUNT(CASE WHEN m.in_trash = true THEN 1 END) AS INTEGER) AS trash,
            
            -- Total number of contacts for the user
            CAST(COUNT(*) AS INTEGER) AS contacts
        FROM
            contact c
        -- Left join to include all contacts, even if no messages exist
        LEFT JOIN
            message m ON c.user_id = m.user_id
        -- Filter for the specified user
        WHERE
            c.user_id = $1
        -- Group results by user_id
        GROUP BY
            c.user_id;

      `,
      [userId]
    );
    console.log("Amount Indicators: ", result.rows);

    return result.rows[0] as AmountIndicators;
  } catch (error) {}
}
