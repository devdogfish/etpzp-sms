"use client";

import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormSchema } from "@/lib/form.schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/form-input";
import { useForm } from "react-hook-form";

import { login } from "@/lib/auth";

export default function LoginForm() {
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    // this makes the inputs controlled
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AuthFormSchema>) {
    console.log(values);
    
    await login(values);
  }

  return (
    <Form {...form}>
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
              control={form.control}
              type="text"
              label="Username"
              placeholder="9120@etpzp.pt"
            />
            <Input
              name="password"
              control={form.control}
              type="password"
              label="Password"
              placeholder="my_password452"
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
