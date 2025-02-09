"use server";

import db from ".";
import { DBMessage, StatusEnums } from "@/types";
import { getSession } from "../auth/sessions";
import { NewRecipient } from "@/types/recipient";

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
              COALESCE(json_agg(json_build_object('id', r.id, 'contact_id', r.contact_id, 'phone', r.phone) ORDER BY r.index) FILTER (WHERE r.id IS NOT NULL), '[]'::json) AS recipients
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

export async function fetchSent(): Promise<DBMessage[] | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log(`Fetching sent messages...`);
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT m.*, 
              COALESCE(json_agg(json_build_object('id', r.id, 'contact_id', r.contact_id, 'phone', r.phone) ORDER BY r.index) FILTER (WHERE r.id IS NOT NULL), '[]'::json) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.send_time < NOW() AND m.in_trash = false
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId]
    );
    console.log(result.rows);

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
              COALESCE(json_agg(json_build_object('id', r.id, 'contact_id', r.contact_id, 'phone', r.phone) ORDER BY r.index) FILTER (WHERE r.id IS NOT NULL), '[]'::json) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.in_trash = true
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId]
    );

    console.log(result.rows);
    return result.rows;
  } catch (error) {}
}

export async function fetchCurrentlyScheduled(): Promise<
  DBMessage[] | undefined
> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("Fetching currently scheduled");
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT m.*, 
              COALESCE(json_agg(json_build_object('id', r.id, 'contact_id', r.contact_id, 'phone', r.phone) ORDER BY r.index) FILTER (WHERE r.id IS NOT NULL), '[]'::json) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.status = 'SCHEDULED' AND m.send_time > NOW()
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId]
    );

    console.log(result.rows);
    return result.rows;
  } catch (error) {}
}

export async function fetchDraft(
  id: string
): Promise<(DBMessage & { recipients: NewRecipient[] }) | undefined> {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!id) throw new Error("ID passed to fetchDraft was invalid!!!");

  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        -- Select the message fields, along with an array of recipients
        SELECT m.*, 
              COALESCE(json_agg(json_build_object(
                  'phone', r.phone,
                  'error', NULL,  -- Assuming no error handling is needed here
                  'contactId', c.id,
                  'contactName', c.name,
                  'contactDescription', c.description
              ) ORDER BY r.index) FILTER (WHERE r.id IS NOT NULL), '[]'::json) AS recipients
        FROM message m
        -- Left join the recipient table to get all recipients for the message
        LEFT JOIN recipient r ON m.id = r.message_id
        -- Left join the contact table to get contact details
        LEFT JOIN contact c ON r.contact_id = c.id
        WHERE m.user_id = $1 AND m.id = $2 AND m.status = 'DRAFTED'
        -- Group the results by message id and order by creation time
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId, id]
    );

    console.log(result.rows);
    return result.rows[0];
  } catch (error) {}
}
