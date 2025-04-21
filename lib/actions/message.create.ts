"use server";

import db from "@/lib/db";
import { MessageSchema } from "../form.schemas";
import { Message } from "@/types";
import { getSession } from "../auth/sessions";
import { formatPhone } from "../utils";
import { NewRecipient } from "@/types/recipient";
import { ActionResponse } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function sendMessage(
  existingDraftId: string | null,
  data: Message
): Promise<
  ActionResponse<Message> & {
    sendDate?: Date;
    invalidRecipients?: NewRecipient[];
    clearForm?: boolean;
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

  // 3. Validate recipients - these are not part of the zod schema as I need to the validation myself
  if (!data.recipients.length) {
    return {
      success: false,
      message: ["new-message-page:server-no_recipients_error"],
    };
  }

  const { validRecipients, invalidRecipients } = analyzeRawRecipients(
    data.recipients
  );
  // The recipient error handling is not handled in the zod validation, so we do validate them ourselves
  if (!validRecipients.length) {
    return {
      success: false,
      message: [`new-message-page:server-invalid_phone_numbers_error`],
      invalidRecipients,
    };
  }

  let scheduledUnixSeconds: number = 0;
  if (
    validatedData.data.secondsUntilSend &&
    validatedData.data.secondsUntilSend > 2
  ) {
    // JavaScript's Date object uses milliseconds, so we divide by 1000 to the timestamp into seconds.
    scheduledUnixSeconds =
      Date.now() / 1000 + validatedData.data.secondsUntilSend;
  }

  const isScheduled =
    !!validatedData.data.secondsUntilSend &&
    validatedData.data.secondsUntilSend > 2; // api requires a minimum of 2 seconds in the future
  try {
    const payload = {
      // This shit can only be one full word with no special characters or spaces
      sender: /**validatedData.data.sender */ "ETPZP", // Hardcode this for now

      message: validatedData.data.body, // this can be any string

      recipients: validRecipients.map(({ phone }) => ({
        msisdn: phone,
      })),

      destaddr: "DISPLAY", // Flash SMS

      // The API is case-sensitive - `sendtime` has to be spelled exactly like this
      sendtime: isScheduled ? scheduledUnixSeconds : undefined, // Insert the UNIX timestamp if the message is scheduled
    };

    const res = await fetch(`${process.env.GATEWAYAPI_URL}/rest/mtsms`, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const resJson = await res.json();

    // -------- BEGIN DATABASE LOGIC -------- //
    if (typeof existingDraftId === "undefined" || !existingDraftId) {
      // Insert new message and recipients
      await db(
        `
          WITH insert_message AS (
            INSERT INTO message (
              subject,
              body,
              status,
              send_time,
              sms_reference_id,
              api_error_code,
              api_error_details_json,
              cost,
              cost_currency,
              user_id
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 $10) 
            RETURNING id
          )
          INSERT INTO recipient (message_id, phone, index)
          SELECT 
            insert_message.id,
            unnest($11::text[]) as phone,
            unnest($12::int[]) as index
          FROM insert_message;
        `,
        [
          // Message data
          validatedData.data.subject, // subject
          validatedData.data.body, // body
          res.ok // status
            ? scheduledUnixSeconds
              ? "SCHEDULED"
              : "SENT"
            : "FAILED",
          scheduledUnixSeconds // sendtime
            ? new Date(scheduledUnixSeconds * 1000)
            : new Date(Date.now()),
          resJson?.ids?.length ? resJson?.ids[0] : null, // sms_reference_id

          // Api errors
          res.ok ? null : res.status, // api_error_code
          res.ok ? null : JSON.stringify(resJson), // api_error_details_json

          // for the ordering of the recipient

          resJson.usage.total_cost,
          resJson.usage.currency,

          userId, // user_id

          // Recipients
          validRecipients.map((recipient) => recipient.phone), // phone number array
          validRecipients.map((_, index) => index),
        ]
      );
    } else {
      // 1. Update message data
      const result = await db(
        `
          UPDATE message
          SET subject = $1,
              body = $2,
              status = $3,
              send_time = $4,
              sms_reference_id = $5,
              api_error_code = $6,
              api_error_details_json = $7,
              cost = $8,
              cost_currency = $9
          WHERE user_id = $10 AND id = $11
          RETURNING id;
        `,
        [
          // Message data
          validatedData.data.subject, // subject
          validatedData.data.body, // body
          res.ok // status
            ? scheduledUnixSeconds
              ? "SCHEDULED"
              : "SENT"
            : "FAILED",
          scheduledUnixSeconds // sendtime
            ? new Date(scheduledUnixSeconds * 1000)
            : new Date(Date.now()),
          resJson?.ids?.length ? resJson?.ids[0] : null, // sms_reference_id

          // Api errors
          res.ok ? null : res.status, // api_error_code
          res.ok ? null : JSON.stringify(resJson), // api_error_details_json

          resJson.usage.total_cost,
          resJson.usage.currency,

          // Other
          userId, // user_id
          existingDraftId, // id of the draft to update
        ]
      );

      // In case update didn't match any rows - invalid message id
      if (result.rowCount === 0) {
        throw new Error("Invalid message id provided");
      }

      // 2. Delete old recipients
      await db(`DELETE FROM recipient WHERE message_id = $1`, [
        existingDraftId,
      ]);
      // 3. Then insert new recipients
      await db(
        `
        INSERT INTO recipient (message_id, phone, index)
        SELECT $1, 
          unnest($2::text[]), 
          unnest($3::int[])
        `, // check if for this query I can use VALUES instead of SELECT
        [
          existingDraftId,
          validRecipients.map((r) => r.phone),
          validRecipients.map((_, index) => index),
        ]
      );
    }
    // -------- END DATABASE LOGIC -------- //

    // Update the amount indicators in the nav panel
    revalidatePath("/new-message");

    if (!res.ok)
      return {
        success: false,
        message: ["server-some_api_error"],
        clearForm: true,
      };

    return {
      success: true,
      message: [
        isScheduled
          ? "new-message-page:server-schedule_success"
          : "new-message-page:server-send_success",
      ],
      sendDate: isScheduled ? new Date(scheduledUnixSeconds * 1000) : undefined,
      clearForm: true,
    };
  } catch (error) {
    console.log("Error got caught in catch block:", error);

    return {
      success: false,
      message: ["new-message-page:server-unknown_error"],
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
