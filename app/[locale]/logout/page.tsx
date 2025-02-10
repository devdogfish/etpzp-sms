"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useLanguage from "@/hooks/use-language";
import useIsMounted from "@/hooks/use-mounted";
import { logout } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [state, setState] = useState({ success: false });
  const [pending, setPending] = useState(false);
  const isMounted = useIsMounted();
  const router = useRouter();

  async function logoutUser() {
    setPending(true);
    const { success } = await logout();
    setPending(false);
    setState({ success });
  }

  useEffect(() => {
    if (isMounted) {
      logoutUser();
    }
  }, [isMounted]);
  return (
    <main className="flex items-center justify-center min-h-screen bg-background px-4">
      {pending ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Signing you out</CardTitle>
            <CardDescription>
              with Microsoft to continue to Etpzp SMS
            </CardDescription>
          </CardHeader>
        </Card>
      ) : state.success ? (
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle className="text-2xl">You are logged out</CardTitle>
            <CardDescription>
              with Microsoft to continue to Etpzp SMS
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <CardContent className="flex flex-col gap-2">
              <Button
                className={buttonVariants({
                  variant: "default",
                  className: "w-min",
                })}
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            </CardContent>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Logout failed</CardTitle>
            <CardDescription>
              Something went wrong while signing you out.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              className={buttonVariants({
                variant: "default",
                className: "w-min",
              })}
              onClick={() => router.refresh()}
            >
              Try again
            </Button>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "secondary",
                className: "w-min",
              })}
            >
              Home
            </Link>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
