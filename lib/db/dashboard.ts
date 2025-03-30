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

  console.log(`Fetching sent messages...`);
  try {
    if (!session?.isAdmin || !session?.isAuthenticated)
      throw new Error("User is not an admin or not authenticated.");

    // Validate input using Zod
    const validatedDates = DateRangeSchema.parse(input);
    const { startDate, endDate } = validatedDates;
    console.log("validatedDates", validatedDates);

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
    console.log("Light messages: ", result.rows.slice(0, 20));

    return result.rows as LightDBMessage[];
  } catch (error) {}
}

export async function fetchUsers() {
  const session = await getSession();

  console.log(`Fetching sent messages...`);
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

    // Validate input using Zod
    const validatedDates = DateRangeSchema.safeParse(input);
    if (!validatedDates.success || validatedDates.data.startDate == undefined)
      throw new Error("Invalid input.");
    const { startDate, endDate } = validatedDates.data;
    console.log("validatedDates", validatedDates);

    const res = await fetch(`${process.env.GATEWAYAPI_URL}/api/usage/labels`, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
        Accept: "application/json, text/javascript",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: format(startDate, API_DATE_FORMAT),
        to: format(endDate || new Date(), API_DATE_FORMAT),
      }),
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const resJson = await res.json();
    console.log(res);
    console.log(resJson);

    return resJson
      .filter((country: { label: string | null }) => country.label === null)
      .map(
        (item: {
          amount: number;
          cost: number;
          country: string;
          currency: string;
          label: null;
        }) => ({
          country: item.country,
          cost: item.cost,
          amount: item.amount,
        })
      );
  } catch (error) {
    console.log(error);
  }
}
