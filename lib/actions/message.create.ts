"use server";
import db from "@/lib/db";
import { MessageSchema } from "../form.schemas";
import { z } from "zod";
import { Message, MessageLocation } from "@/types";
import { getSession } from "../auth/sessions";
import { errorResponse} from './responses'

export async function sendMessage(
  values: z.infer<typeof MessageSchema>
): Promise<ActionResult<any>> {
  // const formattedMessage = message ? message.replace(/\r\n/g, "\n") : "";
  const user = await getSession();
  console.log("VALUES RECEIVED ON SERVER");
  console.log(values, user);

  // TODO implement scheduling message (maybe store if it is scheduled in a differnt field than status because once the sendTime is reached the message's status should change from `scheduled` to `sent`)
  try {
    console.log("Server: about to send sms!");

    const token = process.env.GATEWAYAPI_TOKEN;
    const payload = {
      sender: "TESTSMS", // this shit can only be one fulll word with no special characters or spaces
      message: values.body, // this can be anything
      // the other parameters also don't matter
      // encoding: "UTF8",
      // class: "premium",
      // destaddr: "MOBILE",
      // priority: "BULK",
      // tags: ["%Lastname%", "%Firstname%"],
      // userref: "1234",
      recipients: [
        { msisdn: process.env.MY_NUMBER5 /**tagvalues: ["Maul", "Darth"] */ },
        // { msisdn: process.env.MY_NUMBER5, tagvalues: ["Peter", "Darth"] },
      ],
    };

    const resp = await fetch("https://gatewayapi.com/rest/mtsms", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    // const resp = errorResponse;

    // console.log(resp.json());
    // console.log(resp);

    // 1. Create the message and insert the recipient with the message id from the previous query
    const insertMessageResult = await db(
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
        1,
        values.subject,
        values.body,
        resp.ok ? "sent" : "failed", // status here
        "sent", // location here
        resp.statusText || null,
        // recipient parameters:
        [null, null], // contact_id array
        ["162345678900", "162245678900"], // phone number array
      ]
    );
    console.log(insertMessageResult);

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: {
        message: "Failed to save and/or send message to the database.",
        code: "UNKNOWN_ERROR",
      },
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
