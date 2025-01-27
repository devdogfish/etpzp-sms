"use client";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Maximize2, Minimize2, Trash2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import SendButton from "./send-button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import PageHeader from "./page-header";
import { sendMessage, ActionResponse } from "@/lib/actions/message.create";

// Form
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useActionState, useEffect, useState } from "react";

import RecipientsInput from "./recipients-input";
import { ContactModalsProvider } from "@/contexts/use-contact-modals";
import { useNewMessage } from "@/contexts/use-new-message";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActionResult } from "@/types/action";
import { toast } from "sonner";
import { NewRecipient } from "@/types/recipient";
import { DBContact } from "@/types/contact";

// contact manipulation modals
import InsertContactModal from "./modals/insert-contact-modal";
import CreateContactModal from "./modals/create-contact-modal";
import InfoContactModal from "./modals/info-contact-modal";
import Link from "next/link";
import { useLayout } from "@/contexts/use-layout";

const initialState: ActionResponse = {
  success: false,
  message: [],
};
export default function NewMessageForm({
  contacts,
}: {
  contacts: ActionResult<DBContact[]>;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { recipients, moreInfoOn } = useNewMessage();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [serverState, setServerState] = useState(initialState);
  const { isFullscreen, toggleFullscreen } = useLayout();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    console.log("submitting form with these recipients:", recipients);

    const result = await sendMessage({
      sender: formData.get("sender") as string,
      recipients: recipients as NewRecipient[],
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
    });

    console.log(`result on client`);
    console.log(result);

    setLoading(false);
    setServerState(result);

    if (result.success) {
      toast.success(result.message[0], { description: result.message[1] });
    } else {
      const zodErrors = result.errors || {};
      let waitTime = 0;
      const inBetweenTime = 300;
      Object.entries(zodErrors).forEach(
        ([input, errorArray], index) =>
          setTimeout(() => {
            toast.error(input, { description: errorArray.join(", ") });
            waitTime += index * inBetweenTime;
            console.log(index, waitTime);
          }, index * inBetweenTime) // Increase delay by 50ms for each error
      );
      setTimeout(() => {
        toast.error(result.message[0], { description: result.message[1] });
      }, Object.entries(zodErrors).length * inBetweenTime);
    }
  };
  return (
    <ContactModalsProvider>
      {/* We can only put the modal here, because it carries state */}
      <InsertContactModal contacts={contacts.data || []} />
      {moreInfoOn && <InfoContactModal recipient={moreInfoOn} />}
      {moreInfoOn && !moreInfoOn.contactId && (
        <CreateContactModal defaultPhone={moreInfoOn.phone} />
      )}

      <PageHeader title={subject ? subject : t("NEW_MESSAGE")}>
        <Button
          variant="ghost"
          className="aspect-1 p-0"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <Link
          className={cn(buttonVariants({ variant: "ghost" }), "aspect-1 p-0")}
          href="/sent"
        >
          <X className="h-4 w-4" />
        </Link>
      </PageHeader>
      <form onSubmit={handleSubmit} className="h-screen flex flex-col">
        <div className="flex flex-col h-[calc(100vh-var(--header-height))]">
          <div className="flex flex-col px-4 mt-2">
            <div
              className={cn(
                "border-b focus-within:border-black",
                serverState.errors?.sender && "border-red-500"
              )}
            >
              <Select name="sender" defaultValue="ETPZP">
                {/** It defaults to the first SelectItem */}
                <SelectTrigger className="w-full rounded-none border-none shadow-none focus:ring-0 px-5 py-1 h-11">
                  <SelectValue placeholder="ETPZP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETPZP">ETPZP</SelectItem>
                  <SelectItem value="Test">Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <RecipientsInput
              contacts={contacts.data || []}
              errors={serverState.errors?.recipients}
            />

            <Input
              name="subject"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSubject(e.target.value)
              }
              placeholder="Message subject (optional)"
              className={cn(
                "new-message-input focus-visible:ring-0 placeholder:text-muted-foreground"
                // TODO: Add client side validation here - Make all the invalid recipient have a pulsing animation of the with a red border!! I love this idea!
              )}
            />
          </div>
          <div className="px-4 flex-grow mt-[1.25rem] mb-2">
            <Textarea
              name="body"
              className={cn(
                "border-none rounded-none h-full p-0 focus-visible:ring-0 shadow-none resize-none placeholder:text-muted-foreground",
                serverState.errors?.body &&
                  "ring-red-500 placeholder:text-red-400"
              )}
              placeholder={
                serverState.errors?.body
                  ? serverState.errors?.body[0]
                  : "Start writing your message"
              }
            />
          </div>

          <Separator />
          <div className="flex px-4 py-2 justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              className="w-max"
              onClick={() => router.push("/")}
            >
              <Trash2 className="h-4 w-4" />
              Discard
            </Button>

            <SendButton loading={loading} />
          </div>
        </div>
      </form>
      {/* <UnloadListener /> */}
    </ContactModalsProvider>
  );
}