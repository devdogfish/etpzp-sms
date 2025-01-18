"use server";
import db from "@/lib/db";
import { MessageSchema } from "../form.schemas";
import { Message, Recipient } from "@/types";
import { getSession } from "../auth/sessions";
import { formatPhone } from "../utils";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof Message]?: string[];
  };
  inputs?: {
    sender: string;
    recipients: Recipient[];
    subject: string;
    body: string;
  };
};

export async function sendMessage(data: Message): Promise<ActionResponse> {
  // 1. Check user auth
  const { isAuthenticated, user } = await getSession();
  const userId = user?.id;
  if (!isAuthenticated || !userId) {
    return {
      success: false,
      message: "Failed to authenticate user.",
    };
  }

  data.recipients = convertToValidRecipients(data.recipients);

  // 2. Validate field types
  const validatedData = MessageSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Failed to send SMS. Please fix the errors in the form.",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // 3. The message has to have a valid recipient
  if (!validatedData.data.recipients.length) {
    return {
      success: false,
      message: "Please fix the errors in the form.",
      errors: {
        recipients: [
          "Failed to send SMS. There must be at least one valid recipient.",
        ],
      },
    };
  }

  console.log("Recipients that are about to be FUCK-BOMBED & MOGGED:");
  console.log(validatedData.data.recipients);

  // TODO implement scheduling message (maybe store if it is scheduled in a different field than status because once the sendTime is reached the message's status should change from `scheduled` to `sent`)
  try {
    const payload = {
      // this shit can only be one full word with no special characters or spaces
      sender: validatedData.data.sender,
      message: validatedData.data.body, // this can be string

      recipients: validatedData.data.recipients.map(({ phone }) => ({
        msisdn: phone,
      })),
      destaddr: "DISPLAY", // flash sms
    };

    const resp = await fetch("https://gatewayapi.com/rest/mtsms", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(resp);

    if (!resp.ok) {
      throw new Error("Network response was not ok " + resp.statusText);
    }

    // Using message_id from the message insertion, to create recipient.
    await db(
      `
      WITH insert_message AS (
        INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
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
        resp.ok ? "SENT" : "FAILED", // status here
        "SENT", // By default freshly sent messages are saved to Sent page
        resp.statusText || null,

        // recipient parameters:
        validatedData.data.recipients.forEach(
          (recipient) => recipient.contactId || null
        ), // contact_id array
        validatedData.data.recipients.forEach((recipient) => recipient.phone), // phone number array
      ]
    );
    console.log("------\n\n");

    return {
      success: true,
      message: "Message sent and saved successfully!",
      inputs: data,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to save and/or send message to the database.",
    };
  }
}

// export async function saveMessageTo(
//   values: z.infer<typeof MessageSchema>,
//   location: MessageLocation
// ) {}

function convertToValidRecipients(recipients: Recipient[]): Recipient[] {
  const validRecipients: Recipient[] = [];

  recipients.forEach((recipient) => {
    const parsedPhone = formatPhone(recipient.phone);
    if (parsedPhone) {
      validRecipients.push({
        ...recipient,
        phone: parsedPhone as string,
      });
    }
  });

  return validRecipients;
}
