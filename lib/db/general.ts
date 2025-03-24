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
      SELECT lang, profile_color_id, display_name, dark_mode, primary_color_id, appearance_layout
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
    // We need to do two separate queries, because I got issues when trying to merge it into one. Maybe come back to this later and create one query to all of them.
    const messageCount = await db(
      `
        SELECT
            COALESCE(SUM(CASE 
              WHEN 
                user_id = $1 AND 
                in_trash = false AND 
                status NOT IN ('FAILED', 'DRAFTED') AND
                send_time <= NOW() 
              THEN 1 END), 0)::INTEGER AS sent,
            COALESCE(SUM(CASE 
              WHEN 
                user_id = $1 AND 
                in_trash = false AND 
                status NOT IN ('FAILED', 'DRAFTED') AND
                send_time > NOW() 
              THEN 1 END), 0)::INTEGER AS scheduled,
            COALESCE(SUM(CASE WHEN status = 'FAILED' AND in_trash = false THEN 1 END), 0)::INTEGER AS failed,
            COALESCE(SUM(CASE WHEN status = 'DRAFTED' AND in_trash = false THEN 1 END), 0)::INTEGER AS drafts,
            COALESCE(SUM(CASE WHEN in_trash = true THEN 1 END), 0)::INTEGER AS trash
        FROM
            message
        WHERE
            user_id = $1;
      `,
      [userId]
    );
    const contactsCount = await db(
      `
      SELECT
          CAST(COUNT(c.id) AS INTEGER)
      FROM
          contact c
      WHERE
          c.user_id = $1;
    `,
      [userId]
    );

    return {
      ...messageCount.rows[0],
      contacts: contactsCount.rows[0].count,
    } as AmountIndicators;
  } catch (error) {}
}
