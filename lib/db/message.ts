"use server";

import db from ".";
import {
  AmountIndicators,
  DBMessage,
  LocationEnums,
  StatusEnums,
} from "@/types";
import { getSession } from "../auth/sessions";
import { ActionResult } from "@/types/action";

export async function fetchMessagesByLocation(
  location: LocationEnums
): Promise<ActionResult<DBMessage[]>> {
  console.log(`Fetching messages that are in ${location}.`);
  const session = await getSession();
  try {
    const userId = session?.user?.id;
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "SELECT * FROM message WHERE user_id = $1 AND location = $2 ORDER BY created_at DESC;",
      [userId, location]
    );

    return { success: true, message: "", data: result.rows };
  } catch (error) {
    return { success: false, message: "An unknown error occurred.", data: [] };
  }
}

export async function fetchMessagesByStatus(
  status: StatusEnums
): Promise<ActionResult<DBMessage[]>> {
  console.log(`Fetching messages that are in ${status} status.`);
  const session = await getSession();
  try {
    const userId = session?.user?.id;
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "SELECT * FROM message WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC;",
      [userId, status]
    );

    return { success: true, message: "", data: result.rows };
  } catch (error) {
    return { success: false, message: "An unknown error occurred.", data: [] };
  }
}

export async function fetchAmountIndicators(): Promise<
  AmountIndicators | undefined
> {
  const session = await getSession();
  try {
    const userId = session?.user?.id;
    if (!userId) throw new Error("Invalid user id.");
    const allMessages = db("SELECT COUNT(*) FROM message WHERE user_id = $1;", [
      userId,
    ]);
    const sentResult = db(
      "SELECT COUNT(*) FROM message WHERE user_id = $1 AND location = $2;",
      [userId, "SENT"]
    );
    const draftsResult = db(
      "SELECT COUNT(*) FROM message WHERE user_id = $1 AND location = $2;",
      [userId, "DRAFT"]
    );
    const trashResult = db(
      "SELECT COUNT(*) FROM message WHERE user_id = $1 AND location = $2;",
      [userId, "TRASH"]
    );
    // const notifications = db(
    //   "SELECT COUNT(*) FROM message WHERE user_id = $1 AND location $2;",
    //   [userId, "DRAFT"]
    // );
    const [sent, drafts, trash, all] = await Promise.all([
      sentResult,
      draftsResult,
      trashResult,
      allMessages,
      // notifications,
    ]);
    return {
      sent: sent.rows[0].count,
      drafts: drafts.rows[0].count,
      trash: trash.rows[0].count,
      all: all.rows[0].count,
    };
  } catch (error) {}
}
