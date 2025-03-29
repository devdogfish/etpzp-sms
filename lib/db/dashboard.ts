import { getSession } from "../auth/sessions";
import db from ".";
import { DBMessage } from "@/types";
import { DBUser } from "@/types/user";
import { format } from "date-fns";
import { CountryStat } from "@/app/[locale]/dashboard/page";
import { ISO8601_DATE_FORMAT as API_DATE_FORMAT } from "@/global.config";

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

export async function fetchCountryStats(input: {
  startDate: string | undefined;
  endDate: string | undefined;
}): Promise<CountryStat[] | undefined> {
  if (!input.startDate) return undefined;
  try {
    // console.log(
    //   "sending fetch with these body:",
    //   JSON.stringify({
    //     from: format(timeRange.from, API_DATE_FORMAT),
    //     to: format(timeRange.to, API_DATE_FORMAT),
    //   })
    // );

    const res = await fetch(`${process.env.GATEWAYAPI_URL}/api/usage/labels`, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.GATEWAYAPI_TOKEN}`,
        Accept: "application/json, text/javascript",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: format(input.startDate, API_DATE_FORMAT),
        to: format(input.endDate || new Date(), API_DATE_FORMAT),
      }),
    });
    console.log(res);
    const resJson = await res.json();
    console.log(res.headers.get("Content-Type"));
    console.log(resJson);
    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }
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
    console.log("error occurred", error);
  }
}
