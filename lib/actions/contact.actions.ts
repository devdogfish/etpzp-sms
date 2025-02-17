"use server";

import db from "../db";
import { ContactSchema } from "../form.schemas";
import { DBContact } from "@/types/contact";
import { getSession } from "../auth/sessions";
import { formatPhone } from "../utils";
import { revalidatePath } from "next/cache";
import { DatabaseError } from "pg";
import { ActionResponse, CreateContactResponse } from "@/types/action";
import { z } from "zod";

export async function createContact(
  _: CreateContactResponse | null,
  formData: FormData
): Promise<CreateContactResponse> {
  const session = await getSession();
  const userId = session?.user?.id;

  const rawData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    description: formData.get("description") as string,
  };
  const validatedData = ContactSchema.safeParse(rawData);
  if (!validatedData.success) {
    return {
      success: false,
      message: ["common:fix_zod_errors"],
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }

  try {
    if (!userId) throw new Error("Invalid user id.");

    const { name, phone, description } = validatedData.data;
    const validatedPhone = formatPhone(phone);
    if (!validatedPhone)
      throw new Error("Phone number is unexpectedly invalid!");

    const result = await db(
      `INSERT INTO contact (user_id, name, phone, description) VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, name, validatedPhone, description || null]
    );
    console.log(result.rows[0]);

    // This was messing everything up because it was re-rendering the form component, losing all the state
    revalidatePath("/");

    return {
      success: true,
      message: ["modals:create_contact-success"],
      data: result.rows[0],
    };
  } catch (error) {
    let message = "";
    if (error instanceof DatabaseError && error.code === "23505") {
      // check if it is a duplicate key error by comparing it with the error code
      message = "modals:zod_error-duplicate_phone";
    } else {
      message = "modals:create_contact-unknown_error";
    }

    return {
      success: false,
      message: [message],
      inputs: rawData,
    };
  }
}

export async function updateContact(
  id: string,
  _: ActionResponse<DBContact> | null,
  formData: FormData
): Promise<ActionResponse<z.infer<typeof ContactSchema>>> {
  const session = await getSession();
  const userId = session?.user?.id;

  const rawData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    description: formData.get("description") as string,
  };
  const validatedData = ContactSchema.safeParse(rawData);
  if (!validatedData.success) {
    return {
      success: false,
      message: ["common:fix_zod_errors"],
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }
  try {
    if (!userId) throw new Error("Invalid user id.");

    const { name, phone, description } = validatedData.data;
    const validatedPhone = formatPhone(phone);

    await db(
      "UPDATE contact SET name = $1, phone = $2, description = $3 WHERE user_id = $4 AND id = $5",
      [name, validatedPhone, description || null, userId, id]
    );

    revalidatePath("/contacts");

    return { success: true, message: ["modals:edit_contact-success"] };
  } catch (error) {
    let message;
    if (error instanceof DatabaseError && error.code === "23505") {
      // check if it is a duplicate key error by comparing it with the error code
      message = "modals:zod_error-duplicate_phone";
    } else {
      message = "modals:create_contact-unknown_error";
    }

    return {
      success: false,
      message: [message],
      inputs: rawData,
    };
  }
}

export async function deleteContact(
  id: string
): Promise<ActionResponse<undefined>> {
  const session = await getSession();
  const userId = session?.user?.id;

  try {
    if (!userId) throw new Error("Invalid user id.");
    await db("DELETE FROM contact WHERE user_id = $1 AND id = $2", [
      userId,
      id,
    ]);
    revalidatePath("/contacts");
    return { success: true, message: ["contacts-page:server-delete_success"] };
  } catch (error) {
    return {
      success: false,
      message: ["contacts-page:server-delete_unknown_error"],
    };
  }
}
