import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import { getSession } from "@/lib/auth/sessions";

export default async function LoginPage() {
  const activeSession = await getSession();
  // const activeSession = { isAuthenticated = false };

  if (activeSession.isAuthenticated) {
    // console.log("You are already logged in");
    // console.log(activeSession)
    // redirect("/");
  }

  return (
    <main className="flex items-center justify-center w-screen h-screen p-3">
      <LoginForm />
    </main>
  );
}
