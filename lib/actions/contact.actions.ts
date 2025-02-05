"use server";

import db from "../db";
import { ContactSchema } from "../form.schemas";
import { DBContact } from "@/types/contact";
import { getSession } from "../auth/sessions";
import { formatPhone, sleep } from "../utils";
import { revalidatePath } from "next/cache";
import { DatabaseError } from "pg";
import { ActionResponse } from "@/types/action";
import { z } from "zod";
import { CreateContactActionResponse } from "@/components/modals/create-contact-from-recipient-modal";

export async function createContact(
  _: CreateContactActionResponse<z.infer<typeof ContactSchema>> | null,
  formData: FormData
): Promise<CreateContactActionResponse<z.infer<typeof ContactSchema>>> {
  const session = await getSession();

  const userId = parseInt(session.user?.id || "");
  if (userId && isNaN(userId)) {
    return {
      success: false,
      message: ["Invalid user id."],
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
      message: ["Please fix the errors in the form"],
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }

  try {
    console.log("Fields validated");
    console.log(validatedData);

    const { name, phone, description } = validatedData.data;
    const validatedPhone = formatPhone(phone);
    if (!validatedPhone)
      throw new Error("Phone number is unexpectedly invalid!");

    const result = await db(
      `INSERT INTO contact (user_id, name, phone, description) VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, name, validatedPhone, description || null]
    );
    console.log(result.rows[0]);

    // this is messing everything up
    // revalidatePath("/");

    return {
      success: true,
      message: ["Contact created successfully!"],
      data: result.rows[0],
    };
  } catch (error) {
    let message = "";
    if (error instanceof DatabaseError && error.code === "23505") {
      // check if it is a duplicate key error by comparing it with the error code
      message = "Phone number already exists in another contact";
    } else {
      message = "An unknown error occurred. Failed to create contact.";
    }
    console.log("END CATCH BLOCK", message);

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

  const userId = parseInt(session.user?.id || "");
  if (userId && isNaN(userId)) {
    return {
      success: false,
      message: ["Invalid user id."],
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
      message: ["Please fix the errors in the form"],
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }
  try {
    console.log("Fields validated");
    console.log(validatedData);

    const { name, phone, description } = validatedData.data;
    const validatedPhone = formatPhone(phone);
    if (!validatedPhone)
      throw new Error("Phone number is unexpectedly invalid!");

    await db(
      "UPDATE contact SET name = $1, phone = $2, description = $3 WHERE user_id = $4 AND id = $5",
      [name, validatedPhone, description || null, userId, id]
    );

    revalidatePath("/contacts");

    return { success: true, message: ["Contact updated successfully!"] };
  } catch (error) {
    let message;
    if (error instanceof DatabaseError && error.code === "23505") {
      // check if it is a duplicate key error by comparing it with the error code
      message = "Phone number already exists in another contact";
    } else {
      message = "An unknown error occurred. Failed to create contact.";
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

  const userId = parseInt(session.user?.id ? session?.user?.id : "");
  if (userId && isNaN(userId)) {
    return {
      success: false,
      message: ["Invalid user id."],
    };
  }

  try {
    await db("DELETE FROM contact WHERE user_id = $1 AND id = $2", [
      userId,
      id,
    ]);
    revalidatePath("/contacts");
    return { success: true, message: ["Contact deleted successfully!"] };
  } catch (error) {
    // Check if we are
    return {
      success: false,
      message: ["An unknown error occurred. Failed to delete contact."],
    };
  }
}
