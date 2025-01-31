"use server";

import db from ".";
import {
  AmountIndicators,
  DBMessage,
  CategoryEnums,
  StatusEnums,
} from "@/types";
import { getSession } from "../auth/sessions";

export async function fetchMessagesByLocation(
  location: CategoryEnums
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

export async function fetchTrashedMessages(): Promise<DBMessage[] | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("fetching trashed messages");
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "SELECT * FROM message WHERE user_id = $1 AND in_trash = true ORDER BY created_at DESC;",
      [userId]
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

    const sentResult = await db("SELECT * FROM message WHERE user_id = $1;", [
      userId,
    ]);
    console.log("fetched all messages to sort using js");
    console.log(sentResult.rows);

    return {
      sent: 1,
      scheduled: 6,
      failed: 1,
      drafted: 0,
      trashed: 1,
    };
  } catch (error) {}
}
