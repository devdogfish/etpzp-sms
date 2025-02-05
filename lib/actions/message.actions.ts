"use server";

import { DraftActionResponse, ActionResponse } from "@/types/action";
import { getSession } from "../auth/sessions";
import db from "../db";
import { revalidatePath } from "next/cache";
import { DBRecipient } from "@/types/recipient";
import { DBMessage, Message } from "@/types";

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

export async function saveDraft(
  draftId: string | undefined,
  data: Message
): Promise<DraftActionResponse<string>> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    let draft;
    console.log(
      data.recipients.map((recipient) => recipient.contactId || null), // contact_id array
      data.recipients.map((recipient) => recipient.phone)
    );

    if (draftId) {
      const [_, draftQuery] = await Promise.all([
        // delete old recipients to then update them with our new ones
        db(`DELETE FROM recipient WHERE message_id = $1`, [draftId]),
        // Update existing draft
        db(
          `
            WITH insert_message AS (
              UPDATE message SET subject = $3, body = $4, sender = $5 WHERE id = $2 AND user_id = $1
              RETURNING *
            ),
            insert_recipients AS (
              INSERT INTO recipient (message_id, contact_id, phone)
              SELECT
                insert_message.id, 
                unnest($6::int[]) as contact_id,
                unnest($7::text[]) as phone
              FROM insert_message
            )
            SELECT * FROM insert_message
          `,
          [
            userId,
            draftId,
            data.subject,
            data.body,
            data.sender,

            // Recipients / contacts
            data.recipients.map((recipient) => recipient.contactId || null), // contact_id array
            data.recipients.map((recipient) => recipient.phone),
          ]
        ),
      ]);
      draft = draftQuery;
    } else {
      console.log("Create new draft");

      // Create new draft
      draft = await db(
        `
          WITH insert_message AS (
            INSERT INTO message (user_id, subject, body, sender, status) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id
          ),
          insert_recipients AS (
            INSERT INTO recipient (message_id, contact_id, phone)
            SELECT 
              insert_message.id, 
              unnest($6::int[]) as contact_id,
              unnest($7::text[]) as phone
            FROM insert_message
          )
          SELECT id FROM insert_message
        `,
        [
          userId,
          data.subject,
          data.body,
          data.sender,
          "DRAFTED",

          // Recipients / contacts
          data.recipients.map((recipient) => recipient.contactId || null), // contact_id array
          data.recipients.map((recipient) => recipient.phone),
        ]
      );
    }

    // revalidatePath("/drafts"); // Revalidate the drafts page if you have one
    return {
      success: true,
      message: ["Draft saved successfully"],
      draftId: draftId || draft.rows[0].id,
    };
  } catch (error) {
    return {
      success: false,
      message: ["An unknown error occurred. Failed to save draft."],
    };
  }
}
