"use server";

import { ActionDataResponse, ActionResponse } from "@/types/action";
import { getSession } from "../auth/sessions";
import db from "../db";
import { revalidatePath } from "next/cache";
import { DBRecipient } from "@/types/recipient";

export async function toggleTrash(
  id: string,
  inTrash: boolean
): Promise<ActionResponse<null>> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    await db(
      "UPDATE message SET in_trash = $1 WHERE user_id = $2 AND id = $3 RETURNING *",
      [inTrash, userId, id]
    );

    revalidatePath("/sent");
    revalidatePath("/failed");

    return {
      success: true,
      message: [
        `Message ${inTrash ? "moved to trash" : "restored"} successfully!`,
      ],
    };
  } catch (error) {
    return {
      success: false,
      message: [
        `An unknown error occurred. Failed to ${
          inTrash ? "move message to trash" : "restore message"
        }.`,
      ],
    };
  }
}

export async function deleteMessage(id: string): Promise<ActionResponse<null>> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "DELETE FROM message WHERE user_id = $1 AND id = $2",
      [userId, id]
    );

    console.log(result);

    revalidatePath("/trash");
    return { success: true, message: ["Message deleted successfully!"] };
  } catch (error) {
    // Check if we are
    return {
      success: false,
      message: ["An unknown error occurred. Failed to delete message."],
    };
  }
}

export async function createDraft(
  recipients: DBRecipient[]
): Promise<ActionDataResponse<string>> {
  const session = await getSession();
  const userId = session?.user?.id;

  console.log("Creating draft...");
  try {
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      `
        WITH insert_message AS (
          INSERT INTO message (user_id, body, status) 
          VALUES ($1, $2, $3) 
          RETURNING id
        ),
        insert_recipients AS (
          INSERT INTO recipient (message_id, contact_id, phone)
          SELECT 
            insert_message.id, 
            unnest($4::int[]) as contact_id,
            unnest($5::text[]) as phone
          FROM insert_message
        )
        SELECT id FROM insert_message
      `,
      [
        userId,
        "",
        "DRAFTED",
        recipients.map((recipient) => recipient.contact_id), // contact_id array
        recipients.map((recipient) => recipient.phone),
      ]
    );

    return {
      success: true,
      message: ["Draft saved successfully!"],
      data: result.rows[0].id.toString(),
    };
  } catch (error) {
    // Check if we are
    return {
      success: false,
      message: ["An unknown error occurred. Failed to save draft."],
    };
  }
}
