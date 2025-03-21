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
    sendDate?: Date;
    invalidRecipients?: NewRecipient[];
    clearForm?: boolean;
  }
> {
  console.log("\n\n\n\n\nReceived data on server", data);

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
  // This is the only place where we return a invalid recipient error / the recipient error handling is not handled in the zod validation
  if (!validRecipients.length) {
    return {
      success: false,
      message: [`new-message-page:server-invalid_phone_numbers_error`],
      invalidRecipients,
    };
  }

  // Convert the our send time from seconds to milliseconds
  // JavaScript's Date object uses milliseconds, so we multiply by 1000 to turn send time into ms. as well
  const isScheduled =
    !!validatedData.data.secondsUntilSend &&
    validatedData.data.secondsUntilSend > 2; // api requires a minimum of 2
  let scheduledUnixSeconds: number = 0;
  if (
    validatedData.data.secondsUntilSend &&
    validatedData.data.secondsUntilSend > 2
  ) {
    scheduledUnixSeconds =
      Date.now() / 1000 + validatedData.data.secondsUntilSend;
    console.log("UNIX EPOCH SECONDS CALCULATED: ", scheduledUnixSeconds);
    console.log(validatedData.data.secondsUntilSend);
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

    console.log("Calling fetch with this body:", payload);

    const res = await fetch(`${process.env.GATEWAYAPI_URL}/rest/mtsms`, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const resJson = await res.json();
    console.log(res, resJson);

    console.log("WE ARE STILL IN TRY BLOCK");

    // const res = SuccessResponse;
    // const resJson = { ids: [null] };

    // if (!res.ok) {
    //   console.log("Something went wrong:", JSON.stringify(resJson));

    //   // throw new Error(
    //   //   "Network resJson was not ok " + res?.statusText
    //   // );
    // }

    // console.log("SAVING REFERENCE_ID", resJson.ids[0] || null);

    const args = [
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

      // Recipients
      validRecipients.map((recipient) => recipient.phone), // phone number array
      validRecipients.map((_, index) => index), // for the ordering of the recipient

      // Other
      userId, // user_id
      existingDraftId, // id of the draft to update
    ];

    console.log("WE ARE STILL IN TRY BLOCK 2");
    console.log("BEGIN DATABASE LOGIC");

    // -------- BEGIN DATABASE LOGIC --------
    if (typeof existingDraftId === "undefined" || !existingDraftId) {
      console.log(
        "The draftId is not defined, creating new message with INSERT query"
      );

      console.log([...args.slice(0, 10)]);

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
              user_id
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $10) 
            RETURNING id
          )
          INSERT INTO recipient (message_id, phone, index)
          SELECT 
            insert_message.id,
            unnest($8::text[]) as phone,
            unnest($9::int[]) as index
          FROM insert_message;
        `,
        [...args.slice(0, 10)] // this gets the first 11 items from the array
      );
    } else {
      console.log(
        `Updating existing message item with draftId: ${existingDraftId}`
      );

      console.log([...args.slice(0, 7), userId, existingDraftId]);
      console.log(
        "Supplying ",
        [...args.slice(0, 7), userId, existingDraftId].length,
        " arguments."
      );

      // Update existing message record
      const result = await db(
        `
          UPDATE message
          SET subject = $1,
              body = $2,
              status = $3,
              send_time = $4,
              sms_reference_id = $5,
              api_error_code = $6,
              api_error_details_json = $7
          WHERE user_id = $8 AND id = $9
          RETURNING id;
        `,
        [...args.slice(0, 7), userId, existingDraftId]
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

    // Update the amount indicators in the nav panel
    revalidatePath("/new-message");

    if (!res.ok)
      return {
        success: false,
        message: ["server-some_api_error"],
        clearForm: true,
      };

    console.log("All operations executed without errors \n------\n\n");
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
    console.log("in catch block:", error);

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
