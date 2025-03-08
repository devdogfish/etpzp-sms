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
    // While this seems quite complex, it is the only one that works. The CAST() syntax is just to convert to integers
    const { rows } = await db(
      `
        SELECT
            -- Count of sent messages (in the past and not in trash)
            CAST(COALESCE(sent_counts.sent, 0) AS INTEGER) AS sent,

            -- Count of scheduled messages (in the future and not in trash)
            CAST(COALESCE(sent_counts.scheduled, 0) AS INTEGER) AS scheduled,

            -- Count of failed messages (not in trash)
            CAST(COALESCE(sent_counts.failed, 0) AS INTEGER) AS failed,

            -- Count of drafted messages (not in trash)
            CAST(COALESCE(sent_counts.drafts, 0) AS INTEGER) AS drafts,

            -- Count of messages in trash
            CAST(COALESCE(sent_counts.trash, 0) AS INTEGER) AS trash,

            -- Total number of contacts for the user
            CAST(COUNT(c.id) AS INTEGER) AS contacts
        FROM
            contact c
        LEFT JOIN (
            SELECT
                user_id,
                COUNT(CASE WHEN send_time < NOW() AND in_trash = false THEN 1 END) AS sent,
                COUNT(CASE WHEN status = 'SCHEDULED' AND in_trash = false AND send_time > NOW() THEN 1 END) AS scheduled,
                COUNT(CASE WHEN status = 'FAILED' AND in_trash = false THEN 1 END) AS failed,
                COUNT(CASE WHEN status = 'DRAFTED' AND in_trash = false THEN 1 END) AS drafts,
                COUNT(CASE WHEN in_trash = true THEN 1 END) AS trash
            FROM
                message
            GROUP BY
                user_id
        ) AS sent_counts ON c.user_id = sent_counts.user_id
        WHERE
            c.user_id = $1
        GROUP BY
            sent_counts.sent, sent_counts.scheduled, sent_counts.failed, sent_counts.drafts, sent_counts.trash, c.user_id;
      `,
      [userId]
    );

    return rows[0] as AmountIndicators;
  } catch (error) {}
}
