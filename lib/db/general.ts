"use server";

import { AmountIndicators } from "@/types";
import { getSession } from "../auth/sessions";
import db from ".";
import { DataActionResponse } from "@/types/action";
import { UserSettings } from "@/types/user";

export async function fetchUserSettings(): Promise<UserSettings | undefined> {
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
    return rows[0];
  } catch (error) {}
}

export async function fetchAmountIndicators(): Promise<AmountIndicators> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    const sentResult = await db(
      `
          SELECT
            COUNT(CASE WHEN send_time < NOW() AND in_trash = false THEN 1 END) AS sent,
            COUNT(CASE WHEN status = 'SCHEDULED' AND in_trash = false AND send_time > NOW() THEN 1 END) AS scheduled,
            COUNT(CASE WHEN status = 'FAILED' AND in_trash = false THEN 1 END) AS failed,
            COUNT(CASE WHEN status = 'DRAFTED' AND in_trash = false THEN 1 END) AS drafted,
            COUNT(CASE WHEN in_trash = true THEN 1 END) AS trashed
          FROM message
          WHERE user_id = $1;
        `,
      [userId]
    );

    return sentResult.rows[0];
  } catch (error) {}
}
