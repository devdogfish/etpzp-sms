import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function LoginForm() {
  return (
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
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="9120@etpzp.pt"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="my_password452"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        {/* <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div> */}
      </CardContent>
    </Card>
  );
}
