"use server";

import db from ".";
import { z } from "zod";
import { ContactSchema } from "../form.schemas";
import { ActionResponse, Contact } from "@/types/contact";
import { getSession } from "../auth/sessions";
import { notFound } from "next/navigation";
import { sleep } from "../utils";
import { revalidatePath } from "next/cache";
import { DatabaseError } from "pg";

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
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  await sleep(2000);

  console.log("form submitted!");
  console.log(formData);
  console.log("");
  console.log();

  const session = await getSession();

  const id = parseInt(session.user.id);
  if (isNaN(id)) {
    return {
      success: false,
      message: "Invalid user id.",
    };
  }
  const rawData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    description: formData.get("description") as string,
  };
  const validatedData = ContactSchema.safeParse(rawData);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Please fix the errors in the form",
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }
  try {
    console.log("Fields validated");
    console.log(validatedData);

    const { name, phone, description } = validatedData.data;
    const result = await db(
      "INSERT INTO contact (user_id, name, phone, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, name, phone, description || null]
    );

    revalidatePath("/contacts");
    return { success: true, message: "Contact created successfully!" };
  } catch (error) {
    let message = "";
    if (error instanceof DatabaseError && error.code === "23505") {
      // check if it is a duplicate key error by comparing it with the error code
      message = "Phone number already exists in another contact";
    } else {
      message = "An unknown error occurred. Failed to create contact.";
    }
    return {
      success: false,
      message,
      inputs: rawData,
    };
  }
}
