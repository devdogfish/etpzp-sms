import { logout } from "@/lib/auth";
import { getSession } from "@/lib/auth/sessions";

export default async function LoginPage() {
  const { success } = await logout();
  return (
    <main className="flex items-center justify-center w-screen h-screen p-3">
      {success ? <>Successfully logged out</> : <>Logout failed</>}
    </main>
  );
}
