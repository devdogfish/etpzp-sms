"use server";

import db from ".";
import { z } from "zod";
import { ContactSchema } from "../form.schemas";
import { Contact } from "@/types/contact";

export async function fetchContacts(): Promise<ActionResult<Contact[]>> {
  try {
    const result = await db("SELECT * FROM contact");
    return { success: true, data: result.rows };
  } catch (error) {
    return {
      success: false,
      error: { message: "Failed to fetch contacts.", code: "DB_ERROR" },
    };
  }
}

export async function createContact(
  values: z.infer<typeof ContactSchema>
): Promise<ActionResult<Contact>> {
  try {
    const { name, phone, description } = ContactSchema.parse(values);
    const result = await db(
      "INSERT INTO contact (name, phone, description) VALUES ($1,$2,$3) RETURNING *",
      [name, phone, description]
    );
    return { success: true, data: result.rows[0] };
  } catch (error) {
    return {
      success: false,
      error: { message: "Failed to create contact.", code: "DB_ERROR" },
    };
  }
}
