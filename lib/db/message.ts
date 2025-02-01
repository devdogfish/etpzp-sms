"use server";

import db from ".";
import { AmountIndicators, DBMessage, StatusEnums } from "@/types";
import { getSession } from "../auth/sessions";

export async function fetchMessagesByStatus(
  status: StatusEnums
): Promise<DBMessage[] | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log(`Fetching messages that are in ${status} status...`);
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT m.*, 
              json_agg(json_build_object('id', r.id, 'contact_id', r.contact_id, 'phone', r.phone)) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.status = $2 AND m.in_trash = false
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId, status]
    );

    return result.rows;
  } catch (error) {}
}

export async function fetchTrashedMessages(): Promise<DBMessage[] | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("Fetching trashed messages...");
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT m.*, 
              json_agg(json_build_object('id', r.id, 'contact_id', r.contact_id, 'phone', r.phone)) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.in_trash = true
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId]
    );

    return result.rows;
  } catch (error) {}
}

export async function fetchCurrentScheduled(): Promise<
  DBMessage[] | undefined
> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("Fetching currently scheduled");
  try {
    if (!userId) throw new Error("Invalid user id.");
    const sentResult = await db(
      `
        SELECT m.*, 
              json_agg(json_build_object('id', r.id, 'contact_id', r.contact_id, 'phone', r.phone)) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.status = 'SCHEDULED' AND m.send_time > NOW()
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId]
    );

    return sentResult.rows;
  } catch (error) {}
}

export async function fetchDraft(id: string): Promise<DBMessage | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    const sentResult = await db(
      `
        SELECT m.*, 
              json_agg(json_build_object('id', r.id, 'contact_id', r.contact_id, 'phone', r.phone)) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.id = $2 AND m.status = 'DRAFTED'
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId, id]
    );

    return sentResult.rows[0];
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
          COUNT(CASE WHEN status = 'SENT' AND in_trash = false THEN 1 END) AS sent,
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
