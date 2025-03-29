import {
  fetchCountryStats,
  fetchMessages,
  fetchUsers,
} from "@/lib/db/dashboard";
import { format } from "date-fns";
import { Metadata } from "next";
import AdminDashboard from "./admin-dashboard";

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
  const _searchParams = await searchParams;
  const messages = await fetchMessages();
  const users = await fetchUsers();
  const countryData = await fetchCountryStats({
    startDate: _searchParams?.start_date,
    endDate: _searchParams?.end_date,
  });
  console.log("re-rendered Dashboard server!!", _searchParams);

  return (
    <AdminDashboard
      messages={messages || []}
      users={users || []}
      countryStats={countryData || []}
    />
  );
}
