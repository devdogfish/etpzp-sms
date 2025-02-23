"use server";

import {
  DraftActionResponse,
  ActionResponse,
  DataActionResponse,
} from "@/types/action";
import { getSession } from "../auth/sessions";
import db from "../db";
import { revalidatePath } from "next/cache";
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
      `
        UPDATE message
        SET in_trash = $1 
        WHERE user_id = $2 AND id = $3;
      `,
      [inTrash, userId, id]
    );

    revalidatePath("/sent");
    revalidatePath("/failed");

    return {
      success: true,
      message: [
        inTrash
          ? "messages-page:server-move_trash_success"
          : "messages-page:server-restore_success",
      ],
    };
  } catch (error) {
    return {
      success: false,
      message: [
        inTrash
          ? "messages-page:server-move_trash_unknown_error"
          : "messages-page:server-restore_unknown_error",
      ],
    };
  }
}

export async function deleteMessage(
  id: string,
  revalidate?: string
): Promise<ActionResponse<null>> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    await db(`DELETE FROM message WHERE user_id = $1 AND id = $2`, [
      userId,
      id,
    ]);

    if (revalidate) revalidatePath(revalidate);

    return {
      success: true,
      message: ["common:server-delete_message_success"],
    };
  } catch (error) {
    return {
      success: false,
      message: ["common:server-delete_message_unknown_error"],
    };
  }
}

export async function cancelCurrentlyScheduled(
  sms_reference_id: number
): Promise<DataActionResponse<DBMessage | undefined>> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");

    const networkResponse = await fetch(
      `${process.env.GATEWAYAPI_URL}/rest/mtsms/${sms_reference_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = await networkResponse.json();

    console.log(networkResponse);
    console.log(response);

    if (!networkResponse.ok) {
      throw new Error(
        "Network response was not ok " + networkResponse?.statusText
      );
    }

    const result = await db(
      `
        UPDATE message
        SET status = 'FAILED', failure_reason = 'The scheduled message was canceled by the user.' 
        WHERE user_id = $1 AND sms_reference_id = $2
      `,
      [userId, sms_reference_id]
    );
    return {
      success: true,
      message: ["messages-page:server-cancel_scheduled_success"],
      data: result.rows[0],
    };
  } catch (error) {
    return {
      success: false,
      message: ["messages-page:server-cancel_scheduled_unknown_error"],
      data: undefined,
    };
  }
}

export async function saveDraft(
  draftId: string | undefined,
  data: Message,
  pathname?: string
): Promise<DraftActionResponse<string>> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    let draft;
    console.log(
      data.recipients.map((recipient) => recipient.contact?.id || null), // contact_id array
      data.recipients.map((recipient) => recipient.phone)
    );

    console.log("BEGIN IF block for saving draft... With this data:");
    console.log(data);

    if (draftId) {
      console.log("Updating old draft...");

      // 1. Delete old recipients first
      await db(`DELETE FROM recipient WHERE message_id = $1`, [draftId]);

      // 2. Insert the new recipients after that
      // We are await these separately so that we can be sure that there are no duplicate recipients
      draft = await db(
        `
            WITH insert_message AS (
              UPDATE message SET subject = $3, body = $4, sender = $5 WHERE id = $2 AND user_id = $1
              RETURNING id
            ),
            insert_recipients AS (
              INSERT INTO recipient (message_id,  phone, index)
              SELECT
                insert_message.id, 
                unnest($6::text[]) as phone,
                unnest($7::int[]) as index
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

          // Recipients
          data.recipients.map((recipient) => recipient.phone), // phone number array
          data.recipients.map((_, index) => index), // for the ordering of the recipient
        ]
      );
    } else {
      console.log("Creating new draft...");

      // Create new draft
      draft = await db(
        `
          WITH insert_message AS (
            INSERT INTO message (user_id, subject, body, sender, status) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id
          ),
          insert_recipients AS (
            INSERT INTO recipient (message_id, phone, index)
            SELECT 
              insert_message.id, 
              unnest($6::text[]) as phone,
              unnest($7::int[]) as index
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

          // Recipients
          data.recipients.map((recipient) => recipient.phone), // phone number array
          data.recipients.map((_, index) => index), // for persisting the user specified recipient order
        ]
      );
    }

    if (pathname) revalidatePath(pathname);

    // revalidatePath("/drafts"); // Revalidate the drafts page if you have one
    return {
      success: true,
      message: ["common:server-save_draft_success"],
      draftId: draftId || draft.rows[0].id,
    };
  } catch (error) {
    return {
      success: false,
      message: ["common:server-save_draft_unknown_error"],
    };
  }
}
