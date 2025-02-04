"use client";

import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Maximize2, Minimize2, Trash2, X } from "lucide-react";
import SendButton from "./send-button";
import { cn, toastActionResult } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import PageHeader from "./page-header";
import { sendMessage } from "@/lib/actions/message.create";

// Form
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import RecipientsInput from "./recipients-input";
import { ContactModalsProvider } from "@/contexts/use-contact-modals";
import { useNewMessage } from "@/contexts/use-new-message";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { NewRecipient } from "@/types/recipient";
import { DBContact } from "@/types/contact";

// contact manipulation modals
import InsertContactModal from "./modals/insert-contact-modal";
import CreateContactModal from "./modals/create-contact-modal";
import InfoContactModal from "./modals/info-contact-modal";
import { useLayout } from "@/contexts/use-layout";
import type { DBMessage, Message } from "@/types";
import { ActionResponse } from "@/types/action";
import { saveDraft } from "@/lib/actions/message.actions";
import useDebounce from "@/hooks/use-debounce";
import useIsMounted from "@/hooks/use-mounted";

const initialState: ActionResponse<Message> = {
  success: false,
  message: [],
};

const NewMessageForm = React.memo(function ({
  contacts,
  error,
  draft,
}: {
  contacts: DBContact[];
  error: string;
  draft?: DBMessage;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { recipients, moreInfoOn, setMessage, message, draftId, setDraftId } =
    useNewMessage();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [serverState, setServerState] = useState(initialState);
  const { isFullscreen, setIsFullscreen } = useLayout();

  // focused state for all 4 inputs in the form to handle their hovering states when this gets refactored
  const [focused, setFocused] = useState([false, false, false, false]);
  const isMounted = useIsMounted();

  let scheduledTime = 0;
  const searchParams = useSearchParams();

  // When the controlled inputs value changes, we update the state
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await sendMessage({
      sender: formData.get("sender") as "ETPZP" | "ExampleSMS" | "Test",
      recipients: recipients as NewRecipient[],
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      sendDelay: scheduledTime as number,
    });

    setLoading(false);
    setServerState(result);

    if (result.success) {
      toast.success(result.message[0], { description: result.message[1] });
      // reset the form
      formRef.current?.reset();
      setMessage((prev) => ({ ...prev, recipients: [] }));
    } else {
      const zodErrors = result.errors || {};
      let waitTime = 0;
      const inBetweenTime = 300;
      Object.entries(zodErrors).forEach(
        ([input, errorArray], index) =>
          setTimeout(() => {
            toast.error(input, { description: errorArray.join(", ") });
            waitTime += index * inBetweenTime;
          }, index * inBetweenTime) // Increase delay by 50ms for each error
      );
      setTimeout(() => {
        toast.error(result.message[0], { description: result.message[1] });
      }, Object.entries(zodErrors).length * inBetweenTime);
    }
  };

  const debouncedSaveDraft = useDebounce(message, 2000);

  useEffect(() => {
    if (isMounted && draft) {
      const { body, subject, sender, recipients } = draft;
      setMessage({ body, subject: subject || undefined, sender, recipients });
    }
  }, []);
  useEffect(() => {
    setDraftId(draft?.id);
    if (isMounted) {
      console.log("saving draft with followign values");
      console.log(message);

      const save = async () => {
        const result = await saveDraft(draftId, message);
        setDraftId(result.draftId);
        toastActionResult(result);
      };
      console.log(
        "Calling draft save action with these args: ",
        draftId,
        message
      );

      save();
    } else console.log("component isn't mounted yet");
  }, [debouncedSaveDraft]);
  return (
    <ContactModalsProvider>
      {/* We can only put the modal here, because it carries state */}
      <InsertContactModal contacts={contacts} />
      <CreateContactModal />

      {moreInfoOn && <InfoContactModal recipient={moreInfoOn} />}
      {moreInfoOn && !moreInfoOn.contactId && (
        <CreateContactModal defaultPhone={moreInfoOn.phone} />
      )}

      <PageHeader title={subject ? subject : t("NEW_MESSAGE")}>
        <Button
          variant="ghost"
          className="aspect-1 p-0"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          className={cn(buttonVariants({ variant: "ghost" }), "aspect-1 p-0")}
          onClick={() => {
            setIsFullscreen(false);
            router.push("/sent");
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </PageHeader>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="h-screen flex flex-col"
      >
        <div className="flex flex-col h-[calc(100vh-var(--header-height))]">
          <div className="flex flex-col px-4 mt-2">
            <div
              className={cn(
                "border-b focus-within:border-black",
                serverState.errors?.sender && "border-red-500"
              )}
            >
              <Select
                name="sender"
                defaultValue={draft?.sender || "ETPZP"}
                onValueChange={(value) => {
                  setMessage((prev) => ({ ...prev, sender: value }));
                }}
              >
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
              contacts={contacts}
              defaultRecipients={draft?.recipients}
              error={!!serverState.errors?.recipients}
            />

            <Input
              name="subject"
              placeholder="Message subject (optional)"
              className={cn(
                "new-message-input focus-visible:ring-0 placeholder:text-muted-foreground border-b border-b-border"
              )}
              onChange={handleInputChange}
              defaultValue={draft?.subject || undefined}
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
              onChange={handleInputChange}
              defaultValue={
                draft?.body || (searchParams.get("body") as string) || undefined
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

            <SendButton
              loading={loading}
              submit={(secondsFromNow: number) => {
                if (formRef.current) {
                  // IMPORTANT - we call .requestSubmit() instead of .submit() here so that handleSubmit() gets called
                  // .submit() submits the form using default behavior with form submission, while .requestSubmit() submits the form as if a submit got clicked
                  scheduledTime = secondsFromNow;
                  console.log(
                    `Message will be sent in ${secondsFromNow} seconds!`
                  );
                  formRef.current.requestSubmit();
                }
              }}
            />
          </div>
        </div>
      </form>
      {/* <UnloadListener /> */}
    </ContactModalsProvider>
  );
});

export default NewMessageForm;
