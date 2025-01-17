"use server";
import db from "@/lib/db";
import { MessageSchema } from "../form.schemas";
import { z } from "zod";
import { Message, MessageLocation, Recipient } from "@/types";
import { getSession } from "../auth/sessions";
import { errorResponse } from "./responses";
import { revalidatePath } from "next/cache";
import parsePhoneNumberFromString from "libphonenumber-js";

type ActionResponse = {
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
  // const formattedMessage = message ? message.replace(/\r\n/g, "\n") : "";
  const { isAuthenticated, user } = await getSession();
  const id = user?.id;
  if (!isAuthenticated || !id) {
    return {
      success: false,
      message: "Failed to authenticate user.",
    };
  }

  // Ensure all numeric strings remain as strings (passing via server-actions numeric strings are automatically converted to integers)
  const sanitizedData = {
    ...data,
    recipients: data.recipients.map((recipient) => ({
      ...recipient,
      id: String(recipient.id),
      contactId: recipient.contactId ? String(recipient.contactId) : undefined,
    })),
  };

  const validatedData = MessageSchema.safeParse(sanitizedData);
  // 1. validate all fields first
  if (!validatedData.success) {
    return {
      success: false,
      message: "Please fix the errors in the form.",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // 2. validate recipients
  validatedData.data.recipients.forEach((recipient) => {
    const parsedPhone = parsePhoneNumberFromString(recipient.phone);
    // console.log("validated phone number result");
    // console.log(parsedPhone);

    // TODO - create an array of valid numbers, and handle the error case where there are no valid recipients at all
  });

  // TODO implement scheduling message (maybe store if it is scheduled in a different field than status because once the sendTime is reached the message's status should change from `scheduled` to `sent`)
  try {
    const payload = {
      sender: validatedData.data.sender, // this shit can only be one full word with no special characters or spaces
      message: validatedData.data.body, // this can be string

      recipients: [{ msisdn: process.env.MY_NUMBER5 }],
      destaddr: "DISPLAY", // flash sms
    };

    const resp = await fetch("https://gatewayapi.com/rest/mtsms", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    // const resp = errorResponse;

    // console.log(resp.json());
    // console.log(resp);

    // Create the message & recipient with the message id from the first insert
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
        id,
        validatedData.data.subject,
        validatedData.data.body,
        resp.ok ? "sent" : "failed", // status here
        "sent", // location here
        resp.statusText || null,
        // recipient parameters:
        validatedData.data.recipients.forEach(
          (recipient) => recipient.contactId
        ), // contact_id array
        validatedData.data.recipients.forEach((recipient) => recipient.phone), // phone number array
      ]
    );
    console.log("------");
    console.log("\n");
    console.log("\n");

    revalidatePath("/");
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

export async function saveMessageTo(
  values: z.infer<typeof MessageSchema>,
  location: MessageLocation
) {}

export async function getStatus() {
  const token = process.env.GATEWAYAPI_TOKEN;
  const resp = await fetch("https://gatewayapi.com/rest/mtsms/1 HTTP/1.1", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json, text/javascript",
      "Content-Type": "application/json",
    },
  });
  console.log(resp);

  return resp.json();
}
