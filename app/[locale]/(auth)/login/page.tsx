"use client";

import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authFormSchema } from "@/lib/form.schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import Input from "@/components/form-input";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
  });

  function onSubmit(values: z.infer<typeof authFormSchema>) {
    console.log(values);
  }

  return (
    <main className="flex items-center justify-center w-screen h-screen p-3">
      <Form {...form} control={form.control}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <Input
                name="username"
                type="text"
                label="Username"
                placeholder="9120@etpzp.pt"
                control={form.control}
              />
              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="my_password452"
                control={form.control}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </main>
  );
}
