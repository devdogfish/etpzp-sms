import { LoginForm } from "@/components/login-form";
import ActiveDirectory from "activedirectory2";
import { findUser } from "@/lib/server/active-directory";
export default function LoginPage() {
  const config = {
    url: process.env.AD_URL,
    baseDN: process.env.AD_BASE_DN,
    username: process.env.AD_USERNAME,
    password: process.env.AD_PASSWORD,
  };

  const ad = new ActiveDirectory(config);

  const groupName = "Comunicação Interna - Alunos CP";

  var sAMAccountName = "2860";
  const user = findUser(ad, sAMAccountName);

  return (
    <main className="flex items-center w-screen h-screen p-3">
      <LoginForm />
    </main>
  );
}
