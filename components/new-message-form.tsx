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
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useActionState, useEffect, useState } from "react";
import RecipientsInput from "./recipients-input";
import { ContactModalProvider } from "@/contexts/use-contact-modal";
import CreateContactModal from "./modals/create-contact-modal-context";
import { Contact, Recipient } from "@/types";
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

const initialState: ActionResponse = {
  success: false,
  message: "",
};
export default function NewMessageForm({
  isFullScreen,
  contacts,
}: {
  isFullScreen: boolean;
  contacts: ActionResult<Contact[]>;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { recipients } = useNewMessage();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [serverState, setServerState] = useState(initialState);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      sender: formData.get("sender") as string,
      recipients: recipients as Recipient[],
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
    };

    const result = await sendMessage(data);
    console.log(`result on client`);
    console.log(result);

    setLoading(false);
    setServerState(result);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  const handleFullScreenRedirect = () => {};
  return (
    <>
      <ContactModalProvider>
        <CreateContactModal />
        <form onSubmit={handleSubmit} className="h-screen flex flex-col">
          <PageHeader title={subject ? subject : t("NEW_MESSAGE")}>
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
              onClick={() => {
                console.log("save a draft");
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </PageHeader>
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
                  <SelectTrigger className="w-full p-0 rounded-none border-none shadow-none focus:ring-0 px-[1.25rem] py-1 h-[2.75rem]">
                    <SelectValue placeholder="ETPZP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETPZP">ETPZP</SelectItem>
                    <SelectItem value="Test">Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <RecipientsInput
                contacts={contacts}
                errors={serverState.errors?.recipients}
              />
              <Input
                name="subject"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSubject(e.target.value)
                }
                placeholder="Message subject (optional)"
                className={cn(
                  "new-message-input focus-visible:ring-0 placeholder:text-muted-foreground",
                  serverState.errors?.subject && "border-red-500"
                )}
              />
            </div>
            <div className="px-4 flex-grow mt-[1.25rem] mb-2">
              <Textarea
                name="body"
                className={cn(
                  "border-none rounded-none h-full p-0 focus-visible:ring-0 shadow-none resize-none placeholder:text-muted-foreground",
                  serverState.errors?.body && "ring-red-500 placeholder:text-red-400"
                )}
                placeholder={
                  serverState.errors?.body
                    ? serverState.errors?.body[0]
                    : "Start writing your message"
                }
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
              <SendButton loading={loading} />
            </div>
          </div>
        </form>
      </ContactModalProvider>
      {/* <UnloadListener /> */}
    </>
  );
}
