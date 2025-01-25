"use server";

import { ActionResponse } from "@/types/action";
import { getSession } from "../auth/sessions";
import db from "../db";
import { revalidatePath } from "next/cache";

export async function moveMessageTo(
  location: "DRAFT" | "TRASH", // same spelling as in the database enum
  id: string
): Promise<ActionResponse<null>> {
  const session = await getSession();
  const userId = parseInt(session.user?.id ? session?.user?.id : "");
  if (userId && isNaN(userId)) {
    return {
      success: false,
      message: "Invalid user id.",
    };
  }

  try {
    await db(
      "UPDATE message SET location = $1 WHERE user_id = $2 AND id = $3",
      [location, userId, id]
    );

    revalidatePath("/sent");
    revalidatePath("/all");
    return { success: true, message: "Message moved to trash successfully!" };
  } catch (error) {
    // Check if we are
    return {
      success: false,
      message: "An unknown error occurred. Failed to move message to trash.",
    };
  }
}

export async function deleteMessage(id: string): Promise<ActionResponse<null>> {
  const session = await getSession();

  const userId = parseInt(session.user?.id ? session?.user?.id : "");
  if (userId && isNaN(userId)) {
    return {
      success: false,
      message: "Invalid user id.",
    };
  }

  try {
    await db("DELETE FROM message WHERE user_id = $1 AND id = $2", [
      userId,
      id,
    ]);

    revalidatePath("/trash");
    return { success: true, message: "Message deleted successfully!" };
  } catch (error) {
    // Check if we are
    return {
      success: false,
      message: "An unknown error occurred. Failed to delete message.",
    };
  }
}


