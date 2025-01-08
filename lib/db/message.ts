import { DBMessage } from "@/types";
import db from ".";
import { getSession } from "../auth/sessions";

export async function fetchMessages(): Promise<DBMessage[]> {
  const session = await getSession();
  // This is a mock function. In a real app, you'd fetch from an API or database
  try {
    const userId = session?.user?.id;
    if (!userId) throw new Error("Invalid user id.");
    const result = await db("SELECT * FROM message WHERE user_id = $1", [
      userId,
    ]);
    return result.rows;
  } catch (error) {
    return [];
  }
}
