"use client";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Loader2, Maximize2, Minimize2, Trash2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import SendButton from "./send-button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import PageHeader from "./page-header";
import { send } from "@/lib/actions/message.create";
import UnloadListener from "./shared/unload-listener";
// Form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Input from "./form-input";
import { newMessageFormSchema } from "@/lib/form.schemas";
import { useRouter } from "next/navigation";
import { saveDraft } from "@/lib/actions/message.create";
import React, { useState } from "react";
import ScheduleMessageDropdown from "./send-button";

export default function NewMessageForm({
  isFullScreen,
}: {
  isFullScreen: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof newMessageFormSchema>>({
    resolver: zodResolver(newMessageFormSchema),
    defaultValues: {
      from: "Test",
      to: "",
      subject: "",
      message: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof newMessageFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    // Here you would typically send the message
    setIsLoading(true);
    const result = await send(values);

    console.log("RESULT HERE:");
    console.log(result);

    setIsLoading(false);
  }

  // 3. Define a draft save handler.
  async function onClose(values: z.infer<typeof newMessageFormSchema>) {
    const result = await saveDraft(values);
    if (result !== null) {
      // Redirect to home page after saving draft
      router.push("/");
    } else {
      // Handle error
      console.error("Failed to save draft");
    }
  }

  // 4. Handle full screen redirect
  function handleFullScreenRedirect() {
    const { from, to, subject, message } = form.getValues();
    const queryParams = new URLSearchParams({
      from,
      to,
      subject,
      message,
    }).toString();
    const page = isFullScreen ? "new" : "new-fullscreen";
    router.push(`/${page}?${queryParams}`);
  }

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    form.reset({
      from: params.get("from") || "Test",
      to: params.get("to") || "",
      subject: params.get("subject") || "",
      message: params.get("message") || "",
    });
  }, [isFullScreen]);
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-screen flex flex-col"
        >
          <PageHeader title={t("new_message")}>
            <Button
              variant="ghost"
              className="aspect-1 p-0"
              onClick={handleFullScreenRedirect}
              type="button"
            >
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              className="aspect-1 p-0"
              onClick={form.handleSubmit(onClose)}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </PageHeader>
          <div className="flex flex-col h-[calc(100vh-var(--header-height))]">
            <div className="flex flex-col px-4 mt-2">
              <Input
                name="from"
                placeholder="From"
                type="text"
                className="h-11 rounded-none pl-5 shadow-none border-b-[1px] border-border focus-visible:border-b-ring focus-visible:ring-0 disabled:opacity-100 placeholder:text-muted-foreground"
                disabled
                control={form.control}
              />
              <Input
                name="to"
                placeholder="To"
                type="text"
                className="h-11 rounded-none pl-5 shadow-none border-b-[1px] border-border focus-visible:border-b-ring focus-visible:ring-0 placeholder:text-muted-foreground"
                control={form.control}
              />
              <Input
                name="subject"
                placeholder="Subject (optional)"
                type="text"
                className="h-11 rounded-none pl-5 shadow-none border-b-[1px] border-border focus-visible:border-b-ring focus-visible:ring-0 placeholder:text-muted-foreground"
                control={form.control}
              />
            </div>
            <div className="px-4 flex-grow mt-5 mb-2">
              <Textarea
                {...form.register("message")}
                className="border-none rounded-none h-full p-0 focus-visible:ring-0 shadow-none resize-none placeholder:text-muted-foreground"
                placeholder="Start writing your message"
              />
            </div>

            <Separator />
            <div className="flex px-4 py-2 justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => router.push("/")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete draft</TooltipContent>
              </Tooltip>

              <SendButton isLoading={isLoading} />
            </div>
          </div>
        </form>
      </Form>

      {/* <UnloadListener /> */}
    </>
  );
}
