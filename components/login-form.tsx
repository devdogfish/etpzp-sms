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
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { ActionResponse } from "@/types/action";
import { Login } from "@/lib/auth.config";
import SubmitButton from "./shared/submit-button";
import { useSession } from "@/hooks/use-session";

const initialState: ActionResponse<Login> = {
  success: false,
  message: "",
};
export default function LoginForm() {
  const router = useRouter();

  const [serverState, action] = useActionState(login, initialState);

  useEffect(() => {
    if (serverState.success) {
      toast.success(serverState.message);
      serverState.inputs = undefined;
      serverState.errors = undefined;
      serverState.message = "";
      router.replace("/");
    }
  }, [serverState]);

  return (
    <form action={action}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="relative w-[60%] h-10 overflow-hidden mb-2">
            {/* Set a height for the parent */}
            <Image
              src="/microsoft-logo.png"
              alt="Microsoft logo"
              layout="fill" // This makes the image fill the parent container
              objectFit="cover" // This will crop the image to fill the container
              quality={100}
            />
          </div>
          <CardTitle className="text-2xl">
            Sign in {/**with Microsoft */}
          </CardTitle>
          <CardDescription>
            with Microsoft to continue to Etpzp SMS
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            id="username"
            type="text"
            placeholder="9120@etpzp.pt"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="my_password452"
          />
          {!serverState.success && (
            <p className="text-sm text-destructive text-center">
              {serverState.message}
            </p>
          )}
          <SubmitButton className="w-full">Login</SubmitButton>
        </CardContent>
      </Card>
    </form>
  );
}
