"use server";
import db from "@/lib/db/.";
import { newMessageFormSchema } from "../form.schemas";
import { z } from "zod";

export async function send(values: z.infer<typeof newMessageFormSchema>) {
  // const formattedMessage = message ? message.replace(/\r\n/g, "\n") : "";
  console.log("VALUES RECEIVED ON SERVER");
  console.log(values);

  // console.log(`Message:\n${formattedMessage}`);

  // Here you can add your server-side logic, such as saving to a database
  // For now, we'll just return a success message
  //   return { success: true, message: "Message submitted successfully" };
  const result = await db("SELECT NOW()");
  return result.rows;
}

export async function saveDraft(values: z.infer<typeof newMessageFormSchema>) {
  console.log("VALUES RECEIVED ON SERVER");
  console.log(values);

  // const formattedMessage = message ? message.replace(/\r\n/g, "\n") : "";
}
