"use client";

import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Maximize2, Minimize2, Trash2, X } from "lucide-react";
import SendButton from "./send-button";
import { capitalize, cn, toastActionResult } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { PageHeader } from "./header";
import { sendMessage } from "@/lib/actions/message.create";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import { useNewMessage } from "@/contexts/use-new-message";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { NewRecipient } from "@/types/recipient";

import { useLayout } from "@/contexts/use-layout";
import type { DBMessage, Message } from "@/types";
import { ActionResponse } from "@/types/action";
import { deleteMessage, saveDraft } from "@/lib/actions/message.actions";
import useDebounce from "@/hooks/use-debounce";
import useIsMounted from "@/hooks/use-mounted";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { EMPTY_MESSAGE, PORTUGUESE_DATE_FORMAT } from "@/global.config";
import { useContacts } from "@/contexts/use-contacts";
import { useModal } from "@/contexts/use-modal";

// apparently, when something gets revalidated or the url gets updated, this component gets re-rendered, while the new-message-context keeps it's state
const NewMessageForm = React.memo(function ({
  message_id,
}: {
  message_id?: DBMessage;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation(["new-message-page"]);
  const router = useRouter();
  const {
    recipients,
    setMessage,
    message,
    focusedInput,
    setFocusedInput,
    form,
    setForm,
  } = useNewMessage();
  const { setModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { isFullscreen, setIsFullscreen } = useLayout();
  const pathname = usePathname();
  const onMobile = useIsMobile();
  const [pendingDraft, setPendingDraft] = useState(false);
  const [draft, setDraft] = useState({
    id: message_id?.id || null,
    pending: false,
  });

  const isMounted = useIsMounted();
  const debouncedSaveDraft = useDebounce(message, 2000);
  const previousDraftRef = useRef(message);
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
    console.log(message.scheduledDate.getTime(), Date.now());

    // Smaller than (<) means it is in the past, while larger than (>) means in the future
    if (
      message.scheduledDateModified &&
      message.scheduledDateConfirmed === false &&
      message.scheduledDate.getTime() < Date.now()
    ) {
      // Prevent the rest of the code of getting executed if the invalid date has not been confirmed yet.
      return setModal((m) => ({ ...m, scheduleAlert: true }));
    }

    setLoading(true);
    setMessage((m) => ({ ...m, scheduledDateConfirmed: false }));

    const formData = new FormData(e.currentTarget);

    console.log("SEnding message with values:", {
      sender: formData.get("sender") as string,
      recipients: recipients as NewRecipient[],
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      secondsUntilSend:
        message.scheduledDate.getTime() > new Date().getTime()
          ? (Math.floor(
              (message.scheduledDate.getTime() - Date.now()) / 1000
            ) as number)
          : undefined,
    });

    const result = await sendMessage(draft.id, {
      sender: formData.get("sender") as string,
      recipients: recipients as NewRecipient[],
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      secondsUntilSend:
        message.scheduledDate.getTime() > new Date().getTime()
          ? (Math.floor(
              (message.scheduledDate.getTime() - Date.now()) / 1000
            ) as number)
          : undefined,
    });

    setLoading(false);
    console.log("Awaited result: ", result);

    // Update the message context with the result errors, so that they can be persisted between draft re-renders
    setMessage((m) => ({
      ...m,
      serverStateErrors: result.errors,
      invalidRecipients: result.invalidRecipients,
    }));

    if (result.success) {
      // Message got sent successfully
      if (result.sendDate) {
        toast.success(
          `${t(result.message[0])} ${format(
            result.sendDate,
            PORTUGUESE_DATE_FORMAT
          )}`
        );
      } else {
        toastActionResult(result, t);
      }
    } else {
      // Unable to send message due to an error:
      // 1. Display input specific error messages
      const zodErrors = result.errors || {};
      let waitTime = 0;
      const inBetweenTime = 300;
      Object.entries(zodErrors).forEach(
        ([input, errorArray], index) =>
          setTimeout(() => {
            toast.error(capitalize(input), {
              description: errorArray.map((error) => t(error)).join(", "),
            });
            waitTime += index * inBetweenTime;
          }, index * inBetweenTime) // Increase delay by 50ms for each error
      );

      // 2. Display general error message
      setTimeout(() => {
        if (result.invalidRecipients) {
          toast.error(
            `${t(result.message)} ${result.invalidRecipients
              .map((r) => r.phone)
              .join(", ")}`
          );
        } else {
          toastActionResult(result, t);
        }
      }, Object.entries(zodErrors).length * inBetweenTime);
    }
    console.log("before clear form block");

    if (result.clearForm === true) {
      console.log("clearing form");

      // 3. Reset the form
      setMessage(EMPTY_MESSAGE); // technically this isn't even needed
      router.push("/new-message");
    }
  };

  // When the user pressed discard at the bottom
  const discardDraft = async () => {
    if (draft.id) {
      // Drafts should also be discarded (deleted) immediately
      const result: ActionResponse<null> = await deleteMessage(draft.id);
      toastActionResult(result, t);
    }

    // The navigation already re-fetches the amount indicators
    router.push("/sent");
  };

  function messageIsEmpty() {
    return (
      !message.body &&
      !message.subject &&
      !message.recipients.length &&
      message.sender === "ETPZP"
    );
  }
  // Saving draft logic
  useEffect(() => {
    if (!isMounted) return;

    const save = async () => {
      if (
        JSON.stringify(debouncedSaveDraft) !==
        JSON.stringify(previousDraftRef.current)
      ) {
        setPendingDraft(true);
        const { draftId } = await saveDraft(draft.id || undefined, message);
        setPendingDraft(false);

        if (draftId) {
          setDraft((prev) => ({ ...prev, id: draftId || null }));
          // Updating the URL revalidates the server (including fetching amount indicators) and re-renders the component.
          const params = new URLSearchParams(searchParams.toString());
          params.set("message_id", draftId);
          router.replace(pathname + "?" + params.toString());
        }
      }
    };

    // Empty drafts should be deleted from db
    const discard = async () => {
      if (draft.id) {
        await deleteMessage(draft.id);

        // Updating the URL revalidates the server (including fetching amount indicators) and re-renders the component.
        const params = new URLSearchParams(searchParams.toString());
        params.delete("message_id");
        router.replace(pathname + "?" + params.toString());
      }
    };

    if (messageIsEmpty()) {
      // Delete the old draft
      discard();
    } else {
      save();
    }
  }, [debouncedSaveDraft]);
  useEffect(() => {
    // Reapply input focus state - sender focusing logic not needed as it is a <Select>.
    if (focusedInput) {
      const inputElement = document.querySelector(
        `[name="${focusedInput}"]`
      ) as HTMLElement;

      // Move cursor to end of textarea to prevent default behavior of placing it at the beginning.
      if (inputElement) {
        if (
          focusedInput === "body" &&
          inputElement instanceof HTMLTextAreaElement
        ) {
          // For textarea, set cursor at the end
          inputElement.focus();
          inputElement.setSelectionRange(
            inputElement.value.length,
            inputElement.value.length
          );
        } else {
          inputElement.focus();
        }
      }
    }
  }, [focusedInput]);

  useEffect(() => {
    if (formRef.current) {
      // console.log(
      //   "Form re-rendered. Re-setting form element:",
      //   formRef.current
      // );

      setForm(formRef.current);
    }
  }, [formRef]);
  return (
    <>
      <PageHeader title={message.subject ? message.subject : t("header")}>
        <p>
          {messageIsEmpty()
            ? ""
            : pendingDraft
            ? t("saving_draft")
            : t("saved_draft")}
        </p>
        {!onMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="aspect-1 p-0"
                onClick={() =>
                  setIsFullscreen((prevFullscreen) => !prevFullscreen)
                }
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("toggle_fullscreen")}</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "aspect-1 p-0"
              )}
              onClick={() => {
                setIsFullscreen(false);
                router.push("/sent");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("common:close")}</TooltipContent>
        </Tooltip>
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
                "border-b focus-within:border-primary",
                message.serverStateErrors?.sender && "border-red-500"
              )}
            >
              <Select
                name="sender"
                defaultValue={message_id?.sender || "ETPZP"}
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
              // Instead of a Zod error, we receive an invalid recipients array for recipient errors.
              error={!!message.invalidRecipients?.length}
              onFocus={() => setFocusedInput("new-recipient")}
              onBlur={() => setFocusedInput(null)}
            />

            <Input
              name="subject"
              placeholder={t("subject_placeholder")}
              className={cn(
                "new-message-input focus-visible:ring-0 placeholder:text-muted-foreground border-b border-b-border"
              )}
              onChange={handleInputChange}
              value={message?.subject || EMPTY_MESSAGE.subject}
              onFocus={() => setFocusedInput("subject")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
          <div className="px-4 flex-grow mt-[1.25rem] mb-2">
            <Textarea
              name="body"
              className={cn(
                "border-none rounded-none h-full p-0 focus-visible:ring-0 shadow-none resize-none placeholder:text-muted-foreground",
                message.serverStateErrors?.body &&
                  "ring-red-500 placeholder:text-red-400 dark:placeholder:text-red-400"
              )}
              placeholder={
                message.serverStateErrors?.body
                  ? t(message.serverStateErrors?.body[0])
                  : t("body_placeholder")
              }
              onChange={handleInputChange}
              value={message?.body || EMPTY_MESSAGE.body}
              onFocus={() => setFocusedInput("body")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>

          <Separator />
          <div className="flex px-4 py-2 justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              className="w-max"
              onClick={discardDraft}
            >
              <Trash2 className="h-4 w-4" />
              {t("discard")}
            </Button>

            <SendButton loading={loading} />
          </div>
        </div>
      </form>
      {/* <UnloadListener /> */}
    </>
  );
});

export default NewMessageForm;
