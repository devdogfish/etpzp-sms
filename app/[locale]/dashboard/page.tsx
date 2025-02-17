import UnauthorizedPage from "@/components/403";
import { getSession } from "@/lib/auth/sessions";
import { NextRequest, NextResponse } from "next/server";

export default async function Dashboard() {
  const session = await getSession();
  console.log("session");
  console.log(session);

  // Don't allow non-admins to see admin-dashboard. Return unauthorized error if authenticated but not admin. This takes you to the typical api page...
  if (!session?.isAdmin) return <UnauthorizedPage />;
  return <div>Dashboard</div>;
}
