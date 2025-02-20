import UnauthorizedPage from "@/components/403";
import { getSession } from "@/lib/auth/sessions";

export default async function Dashboard() {
  const session = await getSession();
  console.log("session");
  console.log(session);

  // Prevent non-admins from viewing the admin-dashboard and display an authorization message.
  if (!session?.isAdmin) return <UnauthorizedPage />;
  return <div>Dashboard</div>;
}
