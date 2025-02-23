"use client";

import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Maximize2, Minimize2, Trash2, X } from "lucide-react";
import SendButton from "./send-button";
import { capitalizeFirstLetter, cn, toastActionResult } from "@/lib/utils";
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
import { ContactModalsProvider } from "@/contexts/use-contact-modals";
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
import { DBContact } from "@/types/contact";

// contact manipulation modals
import InsertContactModal from "./modals/insert-contact-modal";
import RecipientInfoModal from "./modals/recipient-info-modal";
import { useLayout } from "@/contexts/use-layout";
import type { DBMessage, Message } from "@/types";
import { ActionResponse } from "@/types/action";
import { deleteMessage, saveDraft } from "@/lib/actions/message.actions";
import useDebounce from "@/hooks/use-debounce";
import useIsMounted from "@/hooks/use-mounted";
import CreateContactFromRecipientModal from "./modals/create-contact-from-recipient-modal";
import CreateContactModal from "./modals/create-contact-modal";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { PORTUGUESE_DATE_FORMAT } from "@/global.config";

const initialState: ActionResponse<Message> = {
  success: false,
  message: [],
};

const NewMessageForm = React.memo(function ({
  contacts,
  draft,
}: {
  contacts: DBContact[];
  draft?: DBMessage;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation(["new-message-page"]);
  const router = useRouter();
  const {
    recipients,
    moreInfoOn,
    setMessage,
    message,
    draftId,
    setDraftId,
    addRecipient,
    revalidateRecipients,
  } = useNewMessage();
  const [loading, setLoading] = useState(false);
  const [serverState, setServerState] = useState(initialState);
  const { isFullscreen, setIsFullscreen } = useLayout();
  const pathname = usePathname();
  const onMobile = useIsMobile();

  // focused state for all 4 inputs in the form to handle their hovering states when this gets refactored
  const [focused, setFocused] = useState([false, false, false, false]);
  const isMounted = useIsMounted();
  const debouncedSaveDraft = useDebounce(message, 2000);

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
    const existingDraftId = draftId;
    const result = await sendMessage(
      {
        sender: formData.get("sender") as string,
        recipients: recipients as NewRecipient[],
        subject: formData.get("subject") as string,
        body: formData.get("body") as string,
        sendDelay: scheduledTime as number,
      },
      existingDraftId
    );

    setLoading(false);
    setServerState(result);

    if (result.success) {
      // Message got sent successfully
      if (result.scheduledDate) {
        return toast.success(
          `${t(result.message[0])} ${format(
            new Date(result.scheduledDate),
            PORTUGUESE_DATE_FORMAT
          )}`
        );
      }
      toastActionResult(result, t);
      // reset the form
      formRef.current?.reset();
      setMessage((prev) => ({ ...prev, recipients: [] }));
    } else {
      // Something went wrong:
      // Display input specific error messages
      const zodErrors = result.errors || {};
      let waitTime = 0;
      const inBetweenTime = 300;
      Object.entries(zodErrors).forEach(
        ([input, errorArray], index) =>
          setTimeout(() => {
            toast.error(capitalizeFirstLetter(input), {
              description: errorArray.map((error) => t(error)).join(", "),
            });
            waitTime += index * inBetweenTime;
          }, index * inBetweenTime) // Increase delay by 50ms for each error
      );

      // Display general error message
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
  };

  const discardDraft = async () => {
    if (draftId) {
      // Drafts should also be discarded (deleted) immediately
      const result: ActionResponse<null> = await deleteMessage(
        draftId,
        pathname
      );
      toastActionResult(result, t);
    }
    router.push("/sent");
  };

  // Saving draft logic
  useEffect(() => {
    // Set draftId at the top to ensure we use the latest value in the save function.
    setDraftId(draft?.id);

    if (isMounted) {
      const save = async () => {
        const result = await saveDraft(draftId, message);
        setDraftId(result.draftId);
        toastActionResult(result, t);
        if (!draft && result.draftId) {
          // Update the url with the current draft so that when revalidating, the form will keep its values
          const params = new URLSearchParams(searchParams.toString());
          params.set("draft", result.draftId);

          router.push(pathname + "?" + params.toString());
        }
      };

      save();
    }
  }, [debouncedSaveDraft]);
  return (
    <ContactModalsProvider>
      {/* We can only put the modal here, because it carries state */}
      <InsertContactModal contacts={contacts} />
      <CreateContactModal />

      {moreInfoOn && <RecipientInfoModal recipient={moreInfoOn} />}
      {moreInfoOn && !moreInfoOn.contact?.id && (
        <CreateContactFromRecipientModal recipient={moreInfoOn} />
      )}

      <PageHeader title={message.subject ? message.subject : t("header")}>
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
              error={!!serverState.errors?.recipients}
            />

            <Input
              name="subject"
              placeholder={t("subject_placeholder")}
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
                  ? t(serverState.errors?.body[0])
                  : t("body_placeholder")
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
              onClick={discardDraft}
            >
              <Trash2 className="h-4 w-4" />
              {t("discard")}
            </Button>

            <SendButton
              loading={loading}
              submit={(secondsFromNow: number) => {
                if (formRef.current) {
                  // IMPORTANT - we call .requestSubmit() instead of .submit() here so that handleSubmit() gets called
                  // .submit() submits the form using default behavior with form submission, while .requestSubmit() submits the form as if a submit got clicked
                  scheduledTime = secondsFromNow;
                  console.log(
                    `Message will be sent in ${secondsFromNow} seconds or ${Math.floor(
                      secondsFromNow / 60
                    )} minutes!`
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
