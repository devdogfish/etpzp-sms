import { DBMessage, LocationEnums } from "@/types";
import db from ".";
import { getSession } from "../auth/sessions";
import { ActionResponse } from "@/types/action";

export async function fetchMessages(): Promise<DBMessage[]> {
  const session = await getSession();
  try {
    const userId = session?.user?.id;
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "SELECT * FROM message WHERE user_id = $1 ORDER BY created_at DESC;",
      [userId]
    );
    return result.rows;
  } catch (error) {
    return [];
  }
}

export async function fetchMessagesByQuery(
  _: ActionResponse<DBMessage> | null,
  formData: FormData
) {
  console.log("fetching messages");
  const searchTerm = formData.get("search") as string;
  const { isAuthenticated, user } = await getSession();
  const userId = user?.id;
  if (!isAuthenticated || !userId) {
    return {
      success: false,
      message: "Failed to authenticate user.",
    };
  }

  if (typeof searchTerm !== "string") {
    return { success: false, message: "Invalid search term." };
  }
  try {
    const result = await db(
      `
      SELECT * FROM message 
      WHERE user_id = $1 AND
        OR subject ILIKE '%' || $2 || '%'
        OR body ILIKE '%' || $2 || '%'
        OR status = $2;
    `,
      [userId, searchTerm.trim()]
    );
  } catch (error) {
    return [];
  }
}

export async function fetchMessagesByLocation(location: LocationEnums) {
  console.log(`Fetching messages that are in ${location}.`);
  const session = await getSession();
  try {
    const userId = session?.user?.id;
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "SELECT * FROM message WHERE user_id = $1 AND location = $2 ORDER BY created_at DESC;",
      [userId, location]
    );

    return { success: true, message: "", data: result.rows };
  } catch (error) {
    return { success: false, message: "An unknown error occurred.", data: [] };
  }
}

export async function fetchAllMessages() {
  const session = await getSession();
  try {
    const userId = session?.user?.id;
    if (!userId) throw new Error("Invalid user id.");
    const result = await db(
      "SELECT * FROM message WHERE user_id = $1 ORDER BY created_at DESC;",
      [userId]
    );

    return { success: true, message: "", data: result.rows };
  } catch (error) {
    return {
      success: false,
      message: "An unknown error occurred. Unable to fetch all messages.",
      data: [],
    };
  }
}

export async function fetchAmountIndicators() {
  const session = await getSession();
  try {
    const userId = session?.user?.id;
    if (!userId) throw new Error("Invalid user id.");
    const allMessages = db("SELECT COUNT(*) FROM message WHERE user_id = $1;", [
      userId,
    ]);
    const sent = db(
      "SELECT COUNT(*) FROM message WHERE user_id = $1 AND location = $2;",
      [userId, "SENT"]
    );
    const drafts = db(
      "SELECT COUNT(*) FROM message WHERE user_id = $1 AND location = $2;",
      [userId, "DRAFT"]
    );
    const trash = db(
      "SELECT COUNT(*) FROM message WHERE user_id = $1 AND location = $2;",
      [userId, "TRASH"]
    );
    // const notifications = db(
    //   "SELECT COUNT(*) FROM message WHERE user_id = $1 AND location $2;",
    //   [userId, "DRAFT"]
    // );
    const results = await Promise.all([
      sent,
      drafts,
      trash,
      allMessages,
      // notifications,
    ]);
    return results;
  } catch (error) {}
}
