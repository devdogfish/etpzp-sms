"use client";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Loader2, Maximize2, Minimize2, Trash2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import SendButton from "./send-button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import PageHeader from "./page-header";
import {
  sendMessage,
  saveMessageTo,
  getStatus,
} from "@/lib/actions/message.create";
import { Input as ShadcnInput } from "./ui/input";

// Form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./form-input";
import { MessageSchema } from "@/lib/form.schemas";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import RecipientsInput from "./recipients-input";
import { ContactModalProvider } from "@/contexts/use-contact-modal";
import CreateContactModal from "./modals/create-contact-modal";
import { Contact } from "@/types";
import { useNewMessage } from "@/contexts/use-new-message";

export default function NewMessageForm({
  isFullScreen,
  contacts,
}: {
  isFullScreen: boolean;
  contacts: ActionResult<Contact[]>;
}) {
  const { t } = useTranslation();
  const { recipients } = useNewMessage();
  const defaultMessageValues = {
    from: "Test",
    to: [],
    subject: "",
    body: "",
  };
  // 1. Define your form.
  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: defaultMessageValues,
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState<string>("");
  const { message, setMessage } = useNewMessage();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof MessageSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const submitData = { ...values, to: recipients };
    console.log(`Form submitted frontend:`);
    console.log(submitData);

    // Here you would typically send the message
    setIsLoading(true);
    // const result = await sendMessage(submitData);
    const result = await sendMessage({ ...values, to: recipients });
    // const result = await getStatus()
    console.log(`Logging result on the client: ${result}`);

    // console.log("RESULT HERE:");
    // console.log(result);

    setIsLoading(false);
  }

  // 3. Define a draft save handler.
  async function onClose(values: z.infer<typeof MessageSchema>) {
    const result = await saveMessageTo({ ...values, to: recipients }, "drafts");
    if (result !== null) {
      // Redirect to home page after saving draft
      router.push("/");
    } else {
      // Handle error
      console.error("Failed to save draft");
    }
  }

  // 4. Handle full screen redirect
  function handleFullScreenRedirect(values: z.infer<typeof MessageSchema>) {
    setMessage(values);
    console.log(values);

    // const { from, to, subject, body } = form.getValues();
    // const queryParams = new URLSearchParams({
    //   from,
    //   to,
    //   subject,
    //   body,
    // }).toString();
    const page = isFullScreen ? "new-message" : "new-fullscreen";
    router.push(`/${page}`);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // TODO implement recipient recovery through LocalStorage
    form.reset({
      from: params.get("from") || "Test",
      to: recipients,
      subject: params.get("subject") || "",
      body: params.get("message") || "",
    });
  }, [isFullScreen]);

  return (
    <>
      <ContactModalProvider>
        <CreateContactModal />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-screen flex flex-col"
          >
            <PageHeader title={subject ? subject : t("new_message")}>
              <Button
                variant="ghost"
                className="aspect-1 p-0"
                onClick={form.handleSubmit(handleFullScreenRedirect)}
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
                  className="new-message-input placeholder:text-muted-foreground"
                  disabled
                  control={form.control}
                />
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem className="flex-1 py-1">
                      <FormControl>
                        <RecipientsInput contacts={contacts} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <ShadcnInput
                          {...field}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            field.onChange(e);

                            setSubject(e.target.value);
                          }}
                          placeholder="Message subject (optional)"
                          className="new-message-input placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="px-4 flex-grow mt-5 mb-2">
                <Textarea
                  {...form.register("body")}
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
      </ContactModalProvider>
      {/* <UnloadListener /> */}
    </>
  );
}
