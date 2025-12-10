import { getSession } from "../auth/sessions";
import db from ".";
import { DBUser } from "@/types/user";
import { format } from "date-fns";
import { CountryStat } from "@/app/[locale]/dashboard/page";
import { ISO8601_DATE_FORMAT as API_DATE_FORMAT } from "@/global.config";
import { LightDBMessage } from "@/types/dashboard";
import { DateRangeSchema } from "../form.schemas";

export async function fetchMessagesInDateRange(input: {
  startDate: string;
  endDate: string;
}) {
  const session = await getSession();

  try {
    if (!session?.isAdmin || !session?.isAuthenticated)
      throw new Error("User is not an admin or not authenticated.");

    // Validate input using Zod
    const validatedDates = DateRangeSchema.parse(input);
    const { startDate, endDate } = validatedDates;

    const result = await db(
      `
          SELECT id, user_id, send_time, cost FROM message m
          WHERE 
            m.in_trash = false AND 
            m.status NOT IN ('FAILED', 'DRAFTED') AND
            m.send_time BETWEEN $1 AND $2
          ORDER BY send_time ASC;
        `,
      [startDate, endDate]
    );

    return result.rows as LightDBMessage[];
  } catch (error) {}
}

export async function fetchUsers() {
  const session = await getSession();

  try {
    if (!session?.isAdmin || !session?.isAuthenticated)
      throw new Error("User is not an admin or not authenticated.");
    const result = await db(`SELECT * FROM public.user;`);

    return result.rows as DBUser[];
  } catch (error) {}
}

export async function fetchCountryStats(input: {
  startDate: string;
  endDate: string;
}): Promise<CountryStat[] | undefined> {
  if (!input.startDate) return undefined;
  const session = await getSession();

  try {
    if (!session?.isAdmin || !session?.isAuthenticated)
      throw new Error("User is not an admin or not authenticated.");

    // DEMO_FEATURE: The API call is disabled here. Please switch to the main branch to view the implementation
    return [];
  } catch (error) {
    console.log(error);
  }
}
