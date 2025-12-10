"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { ActionResponse } from "@/types/action";
import { Login } from "@/lib/auth/config";
import SubmitButton from "./shared/submit-button";
import { Eye, Router } from "lucide-react";
import { useSettings } from "@/contexts/use-settings";
import { useTranslation } from "react-i18next";
import { toastActionResult } from "@/lib/utils";
import { toast } from "sonner";
import useIsMounted from "@/hooks/use-mounted";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogHeader } from "./ui/dialog";

const initialState: ActionResponse<Login> = {
  success: false,
  message: [],
};
// Why is this not using useActionState - because we need to perform custom actions after authenticating
export default function LoginForm() {
  const [passInputType, setPassInputType] = useState("password");
  const [serverState, setServerState] = useState(initialState);
  const [pending, setPending] = useState(false);
  const { syncWithDB } = useSettings();
  const router = useRouter();
  const { t } = useTranslation(["login-page", "common"]);
  const isMounted = useIsMounted();
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    // Create a FormData from the HTML form element
    const formData = new FormData(event.currentTarget);

    const result = await login(formData);
    setServerState(result);
    toastActionResult(result, t);
    if (result.success) {
      await syncWithDB(); // Fetch users settings from database on login
      router.replace("/");
    }
    setPending(false);
  }

  useEffect(() => {
    if (isMounted) {
      toast("This is a Demo Version", {
        action: {
          label: "Read more",
          onClick: () => setInfoDialogOpen(true),
        },
        duration: Infinity, // or duration: 0 in some versions
        dismissible: true, // allows user to close manually
      });
    }
  }, [isMounted]);

  return (
    <main className="flex items-center justify-center w-screen h-screen p-3">
      <Dialog
        open={infoDialogOpen}
        onOpenChange={(value) => setInfoDialogOpen(value)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demo Version of the App</DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-2">
            <span>
              1. You can sign in with any string; this version does not use the
              Active Directory authentication and will log you in as a dummy
              user.
            </span>
            <span>
              2. API functionality is disabled. Messages are saved in the
              database but not actually sent.
            </span>
            <span>
              3. This demo runs on Vercel. The full school version is deployed
              internally. Regardless, the deployment files are available for
              reference and testing.
            </span>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <form onSubmit={handleSubmit}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <div className="relative w-[60%] overflow-hidden mb-2">
              {/* Set a height for the parent */}
              <Image
                src="/etpzp_sms-logo.png"
                width={80}
                height={80}
                alt="ETPZP-SMS logo"
                // layout="fill" // This makes the image fill the parent container
                // objectFit="cover" // This will crop the image to fill the container
                quality={100}
              />
            </div>
            <CardTitle className="text-2xl">{t("header")}</CardTitle>
            <CardDescription>{t("header_caption")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div>
              <Label htmlFor="email">{t("email_label")}</Label>
              <Input
                name="email"
                id="email"
                type="email"
                defaultValue={serverState.inputs?.email}
                placeholder={t("email_placeholder")}
                aria-describedby="email"
                disabled={pending}
              />
              {serverState.errors?.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {t(serverState.errors.email[0])}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">{t("password_label")}</Label>
              <div className="flex items-center gap-1 relative">
                <Input
                  name="password"
                  id="password"
                  type={passInputType}
                  defaultValue={serverState.inputs?.password}
                  aria-describedby="password"
                  disabled={pending}
                />
                <Button
                  className="absolute right-0 z-10"
                  type="button"
                  variant="none"
                  onClick={() =>
                    setPassInputType((prev) =>
                      prev === "text" ? "password" : "text"
                    )
                  }
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              {serverState.errors?.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {t(serverState.errors.password[0])}
                </p>
              )}
            </div>
            {!serverState.success && (
              <p className="text-sm text-destructive text-center">
                {t(serverState.message[0])}
              </p>
            )}
            <SubmitButton className="w-full">{t("button_submit")}</SubmitButton>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
