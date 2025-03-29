import {
  fetchCountryStats,
  fetchMessagesInDateRange,
  fetchUsers,
} from "@/lib/db/dashboard";
import { format } from "date-fns";
import { Metadata } from "next";
import AdminDashboard from "./admin-dashboard";
import { DEFAULT_START_DATE, ISO8601_DATE_FORMAT } from "@/global.config";

export type CountryStat = { country: string; amount: number; cost: number };
export const metadata: Metadata = {
  title: `${process.env.APP_NAME} - Admin dashboard`,
  description: "Login in to ETPZP-SMS with your active directory account.",
};

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: Promise<{
    // We expect both of these to be in ISO 8601 format (YYYY-MM-DD)
    start_date?: string;
    end_date?: string;
  }>;
}) {
  const s = await searchParams;
  const dateRange = {
    startDate: s?.start_date || format(DEFAULT_START_DATE, ISO8601_DATE_FORMAT),
    endDate: s?.end_date || format(new Date(), ISO8601_DATE_FORMAT),
  };
  const messages = await fetchMessagesInDateRange(dateRange);
  const users = await fetchUsers();
  const countryData = await fetchCountryStats(dateRange);
  console.log("re-rendered Dashboard server!!", s);

  return (
    <AdminDashboard
      messages={messages || []}
      users={users || []}
      countryStats={countryData}
    />
  );
}
