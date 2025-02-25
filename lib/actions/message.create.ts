"use server";

import db from "@/lib/db";
import { MessageSchema } from "../form.schemas";
import { Message } from "@/types";
import { getSession } from "../auth/sessions";
import { formatPhone } from "../utils";
import { NewRecipient } from "@/types/recipient";
import { SuccessResponse } from "./testing/default-response";
import { ActionResponse } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function sendMessage(
  existingDraftId: string | null,
  data: Message
): Promise<
  ActionResponse<Message> & {
    scheduledDate?: Date;
    invalidRecipients?: NewRecipient[];
  }
> {
  // 1. Check authentication
  const { isAuthenticated, user } = await getSession();
  const userId = user?.id;
  if (!isAuthenticated || !userId) {
    return {
      success: false,
      message: ["common:error-authentication"],
    };
  }

  // 2. Validate field types
  const validatedData = MessageSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: ["common:fix_zod_errors"],
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // 3. Validate recipients
  if (!data.recipients.length) {
    return {
      success: false,
      message: ["new-message-page:server-no_recipients_error"],
    };
  }
  const { validRecipients, invalidRecipients } = analyzeRawRecipients(
    data.recipients
  );

  if (!validRecipients.length && invalidRecipients.length) {
    return {
      success: false,
      message: [`new-message-page:server-invalid_phone_numbers_error`],
      invalidRecipients,
    };
  }

  // Convert the our send time from seconds to milliseconds
  // JavaScript's Date object uses milliseconds, so we multiply by 1000 to turn send time into ms. as well
  const isScheduled = !!validatedData.data.sendDelay;
  let scheduledUnixSeconds: number = 0;
  if (validatedData.data.sendDelay && validatedData.data.sendDelay > 0) {
    scheduledUnixSeconds = Date.now() / 1000 + validatedData.data.sendDelay;
    console.log("UNIX EPOCH SECONDS CALCULATED: ", scheduledUnixSeconds);
    console.log(validatedData.data.sendDelay);
  }

  try {
    const payload = {
      // this shit can only be one full word with no special characters or spaces
      sender: validatedData.data.sender,
      message: validatedData.data.body, // this can be any string

      recipients: validRecipients.map(({ phone }) => ({
        msisdn: phone,
      })),

      destaddr: "DISPLAY", // Flash SMS

      // The API is case-sensitive - `sendtime` has to be spelled exactly like this
      sendtime: isScheduled ? scheduledUnixSeconds : undefined, // Extract the UNIX timestamp for scheduled messages
    };

    // const networkResponse = await fetch(
    //   `${process.env.GATEWAYAPI_URL}/rest/mtsms`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   }
    // );
    // const response = await networkResponse.json();
    // console.log(networkResponse, response);

    const networkResponse = SuccessResponse;
    const response = { ids: [null] };

    if (!networkResponse.ok) {
      console.log(JSON.stringify(response));

      throw new Error(
        "Network response was not ok " + networkResponse?.statusText
      );
    }

    console.log("SAVING REFERENCE_ID", response.ids[0] || null);

    // -------- BEGIN DATABASE LOGIC --------
    if (typeof existingDraftId === "undefined" || !existingDraftId) {
      console.log(
        "The draftId is not defined, creating new message with INSERT query"
      );

      // Insert new message and recipients
      await db(
        `
          WITH insert_message AS (
            INSERT INTO message (user_id, subject, body, status, failure_reason, send_time, sms_reference_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id
          )
          INSERT INTO recipient (message_id, contact_id, phone, index)
          SELECT 
            insert_message.id,
            unnest($8::int[]) as contact_id,
            unnest($9::text[]) as phone,
            unnest($10::int[]) as index
          FROM insert_message;
        `,
        [
          // message parameters
          userId,
          validatedData.data.subject,
          validatedData.data.body,
          networkResponse?.ok
            ? scheduledUnixSeconds
              ? "SCHEDULED"
              : "SENT"
            : "FAILED", // status here
          networkResponse?.statusText || null,
          scheduledUnixSeconds
            ? new Date(scheduledUnixSeconds * 1000)
            : new Date(Date.now()),
          response.ids[0] || null,

          // recipient parameters:
          validRecipients.map((recipient) => recipient.contact?.id || null), // contact_id array
          validRecipients.map((recipient) => recipient.phone), // phone number array
          validRecipients.map((_, index) => index), // for the ordering of the recipient
        ]
      );
    } else {
      console.log(
        "Updating existing message item with draftId: ",
        existingDraftId
      );

      // Update existing message record
      const result = await db(
        `
          UPDATE message
          SET subject = $1,
              body = $2,
              status = $3,
              failure_reason = $4,
              send_time = $5,
              sms_reference_id = $6
          WHERE id = $7
          RETURNING id;
        `,
        [
          validatedData.data.subject,
          validatedData.data.body,
          networkResponse?.ok
            ? scheduledUnixSeconds
              ? "SCHEDULED"
              : "SENT"
            : "FAILED",
          networkResponse?.statusText || null,
          scheduledUnixSeconds
            ? new Date(scheduledUnixSeconds * 1000)
            : new Date(Date.now()),
          response.ids[0] || null,
          existingDraftId,
        ]
      );

      // In case update didn't match any rows - invalid message id
      if (result.rowCount === 0) {
        throw new Error("Invalid message id provided");
      }

      // Update or replace the recipients. For simplicity, here we delete the old ones and insert new ones.
      await db(`DELETE FROM recipient WHERE message_id = $1`, [
        existingDraftId,
      ]);
      // check if for this query I can use VALUES instead of SELECT
      await db(
        `
        INSERT INTO recipient (message_id, phone, index)
        SELECT $1, 
          unnest($2::text[]), 
          unnest($3::int[])
        `,
        [
          existingDraftId,
          validRecipients.map((r) => r.phone),
          validRecipients.map((_, index) => index),
        ]
      );
    }
    // -------- END DATABASE LOGIC --------

    console.log("All operations executed without errors \n------\n\n");

    // Update the amount indicators in the nav panel
    revalidatePath("/new-message");
    return {
      success: true,
      message: [
        isScheduled
          ? "new-message-page:server-schedule_success"
          : "new-message-page:server-send_success",
      ],
      scheduledDate: isScheduled
        ? new Date(scheduledUnixSeconds * 1000)
        : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: [
        // TODO TRANSLATION: new-message-page:server-unknown_error
        "Unknown Error",
        "Something went wrong. Please try again later.",
      ],
    };
  }
}

function analyzeRawRecipients(recipients: NewRecipient[]) {
  const validRecipients: NewRecipient[] = [];
  const invalidRecipients: NewRecipient[] = [];

  recipients.forEach((recipient) => {
    const parsedPhone = formatPhone(recipient.phone);
    if (parsedPhone) {
      validRecipients.push({
        ...recipient,
        phone: parsedPhone as string,
      });
    } else {
      invalidRecipients.push(recipient);
    }
  });

  return { validRecipients, invalidRecipients };
}
