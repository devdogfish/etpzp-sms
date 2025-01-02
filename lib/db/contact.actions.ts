"use server";

import db from ".";
import { z } from "zod";
import { ContactSchema } from "../form.schemas";
import { Contact } from "@/types/contact";
import { getSession } from "../auth/sessions";
import { notFound } from "next/navigation";

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
  const session = await getSession();

  const id = parseInt(session.user.id);
  if (isNaN(id))
    return {
      success: false,
      error: { message: "UserId is in incorrect format.", code: "TYPE_ERROR" },
    };
  try {
    const { name, phone, description } = ContactSchema.parse(values);
    const result = await db(
      "INSERT INTO contact (user_id, name, phone, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, name, phone, description]
    );
    return { success: true, data: result.rows[0] };
  } catch (error) {
    return {
      success: false,
      error: { message: "Failed to create contact.", code: "DB_ERROR" },
    };
  }
}
