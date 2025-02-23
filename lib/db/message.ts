"use server";

import db from ".";
import { DBMessage, StatusEnums } from "@/types";
import { getSession } from "../auth/sessions";
import { NewRecipient } from "@/types/recipient";

export async function fetchMessagesByStatus(status: StatusEnums) {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log(`Fetching messages that are in ${status} status...`);
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT m.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                      'id', r.id, 
                      'phone', r.phone
                  ) ORDER BY r.phone -- Order by phone number numerically
                ) FILTER (WHERE r.id IS NOT NULL), '[]'::json
              ) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.status = $2 AND m.in_trash = false
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId, status]
    );

    return result.rows as DBMessage[];
  } catch (error) {}
}

export async function fetchSent() {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log(`Fetching sent messages...`);
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT m.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                      'id', r.id, 
                      'phone', r.phone
                  ) ORDER BY r.phone -- Order by phone number numerically
                ) FILTER (WHERE r.id IS NOT NULL), '[]'::json
              ) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.send_time < NOW() AND m.in_trash = false
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId]
    );
    console.log(result.rows);

    return result.rows as DBMessage[];
  } catch (error) {}
}

export async function fetchTrashedMessages() {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("Fetching trashed messages...");
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT m.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                      'id', r.id, 
                      'phone', r.phone
                  ) ORDER BY r.phone -- Order by phone number numerically
                ) FILTER (WHERE r.id IS NOT NULL), '[]'::json
              ) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.in_trash = true
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId]
    );

    console.log(result.rows);
    return result.rows as DBMessage[];
  } catch (error) {}
}

export async function fetchCurrentlyScheduled() {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("Fetching currently scheduled");
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        SELECT m.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                      'id', r.id, 
                      'phone', r.phone
                  ) ORDER BY r.phone -- Order by phone number numerically
                ) FILTER (WHERE r.id IS NOT NULL), '[]'::json
              ) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.status = 'SCHEDULED' AND m.send_time > NOW()
        GROUP BY m.id
        ORDER BY m.created_at DESC;
      `,
      [userId]
    );

    console.log(result.rows);
    return result.rows as DBMessage[];
  } catch (error) {}
}

export async function fetchDraft(id?: string) {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!id) throw new Error("Invalid draft ID");
    if (!userId) throw new Error("Invalid user id");

    const result = await db(
      `
       SELECT m.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                      'id', r.id, 
                      'phone', r.phone
                  ) ORDER BY r.index -- This determines in which order the recipient chips are on new-message
                ) FILTER (WHERE r.id IS NOT NULL), '[]'::json
              ) AS recipients
        FROM message m
        LEFT JOIN recipient r ON m.id = r.message_id
        WHERE m.user_id = $1 AND m.id = $2 AND m.status = 'DRAFTED'
        GROUP BY m.id;
      `,
      [userId, id]
    );
    console.log("draft fetch result");
    console.log(result.rows[0]);

    return result.rows[0] as DBMessage & { recipients: NewRecipient[] };
  } catch (error) {}
}
