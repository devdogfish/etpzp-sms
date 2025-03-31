import {
  fetchCountryStats,
  fetchMessagesInDateRange,
  fetchUsers,
} from "@/lib/db/dashboard";
import { format } from "date-fns";
import { Metadata } from "next";
import AdminDashboard from "@/components/admin-dashboard";
import { DEFAULT_START_DATE, ISO8601_DATE_FORMAT } from "@/global.config";

export type CountryStat = { country: string; amount: number; cost: number };
export const metadata: Metadata = {
  title: `${process.env.APP_NAME} - Admin dashboard`,
  description:
    "View statistics on message traffic and costs, along with user and country data related to sent messages in the Admin Dashboard.",
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

  return (
    <AdminDashboard
      messages={messages || []}
      users={users || []}
      countryStats={countryData}
    />
  );
}
