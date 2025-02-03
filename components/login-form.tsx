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
import { Login } from "@/lib/auth/config";
import SubmitButton from "./shared/submit-button";
import { Eye } from "lucide-react";

const initialState: ActionResponse<Login> = {
  success: false,
  message: [],
};
export default function LoginForm() {
  const [passInputType, setPassInputType] = useState("password");
  const [serverState, action] = useActionState(login, initialState);

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
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              type="email"
              defaultValue={serverState.inputs?.email}
              placeholder="0000@etpzp.pt"
              aria-describedby="email"
            />
            {serverState.errors?.email && (
              <p id="email-error" className="text-sm text-red-500">
                {serverState.errors.email[0]}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center gap-1 relative">
              <Input
                name="password"
                id="password"
                type={passInputType}
                defaultValue={serverState.inputs?.password}
                aria-describedby="password"
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
                {serverState.errors.password[0]}
              </p>
            )}
          </div>
          {!serverState.success && (
            <p className="text-sm text-destructive text-center">
              {serverState.message[0]}
            </p>
          )}
          <SubmitButton className="w-full">Login</SubmitButton>
        </CardContent>
      </Card>
    </form>
  );
}
