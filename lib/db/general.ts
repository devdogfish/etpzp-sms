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
    const { rows } = await db(
      `
        SELECT
          CAST(COUNT(CASE WHEN send_time < NOW() AND in_trash = false THEN 1 END) AS INTEGER) AS sent,
          CAST(COUNT(CASE WHEN status = 'SCHEDULED' AND in_trash = false AND send_time > NOW() THEN 1 END) AS INTEGER) AS scheduled,
          CAST(COUNT(CASE WHEN status = 'FAILED' AND in_trash = false THEN 1 END) AS INTEGER) AS failed,
          CAST(COUNT(CASE WHEN status = 'DRAFTED' AND in_trash = false THEN 1 END) AS INTEGER) AS drafts,
          CAST(COUNT(CASE WHEN in_trash = true THEN 1 END) AS INTEGER) AS trash,
          CAST((SELECT COUNT(*) FROM contact WHERE contact.user_id = message.user_id) AS INTEGER) AS contacts
        FROM message
        WHERE user_id = $1
        GROUP BY user_id;
      `,
      [userId]
    );
    console.log("amount Indicators fetched");
    console.log(rows);

    return rows[0] as AmountIndicators;
  } catch (error) {}
}
