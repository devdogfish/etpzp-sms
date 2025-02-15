"use client";

import { format } from "date-fns/format";
import { ArrowLeft, Edit, Share, Trash2, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, getNameInitials, toastActionResult } from "@/lib/utils";
import { CopyButton } from "./shared/copy-button";
import { deleteContact } from "@/lib/actions/contact.actions";
import { useContactModals } from "@/contexts/use-contact-modals";
import EditContactModal from "./modals/edit-contact-modal";
import { useRouter } from "next/navigation";
import { DBContact } from "@/types/contact";
import { saveDraft } from "@/lib/actions/message.actions";
import { useTranslation } from "react-i18next";
import ProfilePic from "./profile-pic";

export default function ContactDisplay({
  contact,
  reset,
}: {
  contact: DBContact | null;
  reset: () => void;
}) {
  const onMobile = useIsMobile();
  const router = useRouter();
  const { setModal } = useContactModals();
  const showEditModal = () => setModal((prev) => ({ ...prev, edit: true }));
  // Reset this to the default namespace, because in the layout we have messages-page as default
  const { t } = useTranslation(["contacts-page"]);

  const handleDelete = async () => {
    if (contact) {
      const result = await deleteContact(contact.id);
      toastActionResult(result);
      reset();
    }
  };
  const messageContact = async () => {
    if (contact) {
      const newDraft = await saveDraft(undefined, {
        body: "",
        recipients: [
          {
            phone: contact.phone,
            contactId: contact.id.toString(),
          },
        ],
      });

      if (newDraft.success && newDraft.draftId) {
        router.push(`/new-message?draft=${newDraft.draftId}`);
      } else {
        toastActionResult(newDraft);
      }
    }
  };
  return (
    <div className={cn("flex h-full flex-col")}>
      {contact && <EditContactModal contact={contact} />}
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          {onMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={reset}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">{t("common:go_back")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("common:go_back")}</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!contact}
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">
                  {t("common:delete_permanently")}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("common:delete_permanently")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log("User wants to export a contact")}
                disabled={!contact}
              >
                <Share className="h-4 w-4" />
                <span className="sr-only">{t("common:export")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("common:export")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={showEditModal}
                disabled={!contact}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">{t("common:edit")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("common:edit")}</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {contact && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={reset}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t("common:close")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("common:close")}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <Separator />

      {contact ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <ProfilePic name={contact.name} />
              <h2>{contact.name}</h2>
            </div>
            {contact.created_at && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(contact.created_at), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex gap-4 justify-between items-center p-4 text-sm">
            <p>{t("common:phone_number")}</p>
            <div className="flex">
              <CopyButton text={contact.phone} variant="none" />
              <Button variant="link" className="p-0" onClick={messageContact}>
                {contact.phone}
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex gap-4 justify-between p-4 text-sm">
            <p>{t("common:description")}</p>

            {contact.description ? (
              <p>{contact.description}</p>
            ) : (
              <p className="italic">{t("no_description")}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          {t("none_selected")}
        </div>
      )}
    </div>
  );
}
