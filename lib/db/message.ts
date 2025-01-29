"use server";

import db from ".";
import {
  AmountIndicators,
  DBMessage,
  LocationEnums,
  StatusEnums,
} from "@/types";
import { getSession } from "../auth/sessions";

export async function fetchMessagesByLocation(
  location: LocationEnums
): Promise<DBMessage[] | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log(`Fetching messages that are in ${location}.`);
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "SELECT * FROM message WHERE user_id = $1 AND location = $2 ORDER BY created_at DESC;",
      [userId, location]
    );

    return result.rows;
  } catch (error) {}
}

export async function fetchMessagesByStatus(
  status: StatusEnums
): Promise<DBMessage[] | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log(`Fetching messages that are in ${status} status.`);
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "SELECT * FROM message WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC;",
      [userId, status]
    );

    return result.rows;
  } catch (error) {}
}

export async function fetchAmountIndicators(): Promise<AmountIndicators> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("FETCHING AMOUNT INDICATORS");

  try {
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
