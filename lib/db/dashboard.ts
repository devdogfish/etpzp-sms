import { getSession } from "../auth/sessions";
import db from ".";
import { DBMessage } from "@/types";
import { DBUser } from "@/types/user";

export async function fetchMessages() {
  const session = await getSession();

  console.log(`Fetching sent messages...`);
  try {
    if (!session?.isAdmin) throw new Error("User is not an admin.");
    const result = await db(
      `
          SELECT * FROM message m
          WHERE 
            m.in_trash = false AND 
            m.status NOT IN ('FAILED', 'DRAFTED')
            -- m.send_time ${"PAST" === "PAST" ? "<=" : ">"} NOW() 
          GROUP BY m.id
          ORDER BY m.send_time ASC;
        `
    );

    return result.rows as DBMessage[];
  } catch (error) {}
}

export async function fetchUsers() {
  const session = await getSession();

  console.log(`Fetching sent messages...`);
  try {
    if (!session?.isAdmin) throw new Error("User is not an admin.");
    const result = await db(`SELECT * FROM public.user;`);

    return result.rows as DBUser[];
  } catch (error) {}
}

export async function fetchMessagesFromGatewayApi() {
  
}
