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
  data: Message
): Promise<ActionResponse<Message>> {
  // 1. Check authentication
  const { isAuthenticated, user } = await getSession();
  const userId = user?.id;
  if (!isAuthenticated || !userId) {
    return {
      success: false,
      message: ["Authentication Error", "Please log in to continue."],
    };
  }

  const { validRecipients, invalidRecipients, recipientErrorMessage } =
    analyzeRawRecipients(data.recipients);

  if (recipientErrorMessage !== null) {
    return {
      success: false,
      message: ["Invalid Recipients", recipientErrorMessage],
    };
  }
  // 2. Validate field types
  const validatedData = MessageSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: ["Error Occurred", `Please fix the errors in the below.`],
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  console.log(validatedData.data.sendDelay);
  // if (!validatedData.data.sendDelay) {
  //   return { success: false, message: ["SChedule failed"] };
  // }
  // Convert the our send time from seconds to milliseconds
  // JavaScript's Date object uses milliseconds, so we multiply by 1000 to turn send time into ms. as well
  let scheduledUnixSeconds: number | undefined = undefined;
  if (validatedData.data.sendDelay && validatedData.data.sendDelay > 0) {
    scheduledUnixSeconds = Date.now() / 1000 + validatedData.data.sendDelay;
    console.log("UNIX EPOCH SECONDS CALCULATED: ", scheduledUnixSeconds);
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
      sendtime: scheduledUnixSeconds, // Extract the UNIX timestamp for scheduled messages
    };

    const networkResponse = await fetch(
      `${process.env.GATEWAYAPI_URL}/rest/mtsms`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    // const networkResponse = SuccessResponse;
    console.log("Response");
    console.log(networkResponse);

    if (!networkResponse.ok) {
      console.log(JSON.stringify(await networkResponse.json()));

      throw new Error(
        "Network response was not ok " + networkResponse?.statusText
      );
    }

    console.log(
      `Message is being saved with ${
        networkResponse?.ok
          ? scheduledUnixSeconds
            ? "SCHEDULED"
            : "SENT"
          : "FAILED"
      } status.`
    );
    console.log(
      `Message is scheduled to be sent ${
        scheduledUnixSeconds
          ? "on the " + new Date(scheduledUnixSeconds * 1000) + "."
          : "right now."
      }`
    );

    const response = await networkResponse.json();
    console.log("NetworkResponse.json()");
    console.log(response);

    console.log("SAVING REFERENCE_ID", response.ids[0] || null);

    // Using message_id from the message insertion, to create recipient.
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
        `Sent on (remove this later on):${new Date(
          scheduledUnixSeconds ? scheduledUnixSeconds * 1000 : Date.now()
        )}\n\n ${validatedData.data.body}`,
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
        validRecipients.map((recipient) => recipient.contactId || null), // contact_id array
        validRecipients.map((recipient) => recipient.phone), // phone number array
        validRecipients.map((_, index) => index), // for the ordering of the recipient
      ]
    );
    console.log("------\n\n");

    // Update the amount indicators in the nav panel
    revalidatePath("/");
    return {
      success: true,
      message: [
        "Success!",
        scheduledUnixSeconds
          ? `Your message is scheduled to be sent on ${new Date(
              scheduledUnixSeconds * 1000
            )}`
          : "Your message has been sent successfully.",
      ],
    };
  } catch (error) {
    return {
      success: false,
      message: [
        "Unknown Error",
        "Something went wrong. Please try again later.",
      ],
    };
  }
}

function analyzeRawRecipients(recipients: NewRecipient[]): {
  validRecipients: NewRecipient[];
  invalidRecipients: NewRecipient[];
  recipientErrorMessage: string | null;
} {
  const validRecipients: NewRecipient[] = [];
  const invalidRecipients: NewRecipient[] = [];
  let recipientErrorMessage = null;

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

  if (recipients.length === 0) {
    recipientErrorMessage = "The message must have at least one recipient.";
    console.log(recipientErrorMessage);
  } else if (validRecipients.length === 0 && invalidRecipients) {
    const invalidPhoneNumbers = recipients.map((people) => people.phone);

    recipientErrorMessage = `The following phone ${
      invalidRecipients.length > 1 ? "numbers are" : "number is"
    } not valid: ${invalidPhoneNumbers.join(", ")}`;
  }

  return { validRecipients, invalidRecipients, recipientErrorMessage };
}
