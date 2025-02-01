"use server";

import db from "@/lib/db";
import { MessageSchema } from "../form.schemas";
import { Message } from "@/types";
import { getSession } from "../auth/sessions";
import { formatPhone } from "../utils";
import { NewRecipient } from "@/types/recipient";

export type ActionResponse = {
  success: boolean;
  message: string[];
  errors?: {
    [K in keyof Message]?: string[];
  };
  inputs?: {
    sender: string;
    recipients: NewRecipient[];
    subject: string;
    body: string;
  };
};

export async function sendMessage(data: Message): Promise<ActionResponse> {
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
      errors: { recipients: [recipientErrorMessage] },
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
  }

  try {
    const payload = {
      // this shit can only be one full word with no special characters or spaces
      sender: validatedData.data.sender,
      message: `${new Date(
        scheduledUnixSeconds ? scheduledUnixSeconds * 1000 : Date.now()
      )} ${validatedData.data.body}`, // this can be string

      recipients: validRecipients.map(({ phone }) => ({
        msisdn: phone,
      })),

      destaddr: "DISPLAY", // Flash SMS

      // The API is case-sensitive - `sendtime` has to be spelled exactly like this
      sendtime: scheduledUnixSeconds, // Extract the UNIX timestamp for scheduled messages
    };

    const resp = await fetch("https://gatewayapi.com/rest/mtsms", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      console.log(JSON.stringify(await resp.json()));

      throw new Error("Network response was not ok " + resp?.statusText);
    }

    console.log(
      `Message is being saved with ${
        resp?.ok ? (scheduledUnixSeconds ? "SCHEDULED" : "SENT") : "FAILED"
      } status.`
    );
    console.log(
      `Message is scheduled to be sent ${
        scheduledUnixSeconds
          ? "on the " + new Date(scheduledUnixSeconds * 1000) + "."
          : "right now."
      }`
    );

    // Using message_id from the message insertion, to create recipient.
    await db(
      `
      WITH insert_message AS (
        INSERT INTO message (user_id, subject, body, status, failure_reason, send_time) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id
      )
      INSERT INTO recipient (message_id, contact_id, phone)
      SELECT 
        insert_message.id, 
        unnest($7::int[]) as contact_id,
        unnest($8::text[]) as phone
      FROM insert_message;
      `,
      [
        // message parameters
        userId,
        validatedData.data.subject,
        validatedData.data.body,
        resp?.ok ? (scheduledUnixSeconds ? "SCHEDULED" : "SENT") : "FAILED", // status here
        resp?.statusText || null,
        scheduledUnixSeconds
          ? new Date(scheduledUnixSeconds * 1000)
          : new Date(Date.now()),

        // recipient parameters:
        validRecipients.map((recipient) => recipient.contactId || null), // contact_id array
        validRecipients.map((recipient) => recipient.phone), // phone number array
      ]
    );
    console.log("------\n\n");

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
    console.error(error);

    return {
      success: false,
      message: [
        "Unknown Error",
        "Something went wrong. Please try again later.",
      ],
    };
  }
}

// export async function saveMessageTo(
//   values: z.infer<typeof MessageSchema>
// ) {}

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
