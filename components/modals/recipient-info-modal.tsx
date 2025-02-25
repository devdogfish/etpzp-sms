"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { useContactModals } from "@/contexts/use-contact-modals";
import { Separator } from "../ui/separator";
import { CopyButton } from "../shared/copy-button";
import { Button } from "../ui/button";
import { NewRecipient } from "@/types/recipient";
import { useTranslation } from "react-i18next";
import ProfilePic from "../profile-pic";

export default function RecipientInfoModal({
  recipient,
}: {
  recipient: NewRecipient;
}) {
  const { modal, setModal } = useContactModals();
  const { t } = useTranslation(["modals"]);

  const showCreateFromRecipientModal = () => {
    setModal((prev) => ({ ...prev, info: false }));
    setTimeout(() => {
      setModal((prev) => ({ ...prev, createFromRecipient: true }));
    }, 100);
  };
  return (
    <Dialog
      /* We do need these shits unfortunately */
      open={modal.info}
      onOpenChange={(value: boolean) =>
        setModal((prev) => ({ ...prev, info: value }))
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {/* make it so we can interpolate a one of these translations using {{name}} into the actual one */}
            {recipient.contact?.id
              ? t("info-header_contact")
              : t("info-header_recipient")}
          </DialogTitle>
          <DialogDescription>
            {t("info-header_caption", {
              type: recipient.contact?.id
                ? t("common:contact").toLowerCase()
                : t("common:recipient").toLowerCase(),
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <ProfilePic name={recipient.contact?.name} />
              <h2>{recipient.contact?.name || t("info-name_fallback")}</h2>
            </div>
          </div>
          <Separator />
          <div className="flex gap-4 justify-between items-center p-4 text-sm">
            <div>{t("common:phone_number")}</div>
            <CopyButton text={recipient.phone} variant="none">
              {recipient.phone}
            </CopyButton>
          </div>
          <Separator />
          {recipient.contact?.id && (
            <div className="flex gap-4 justify-between p-4 text-sm">
              <p>{t("common:description")}</p>

              {recipient.contact?.description?.trim() ? (
                <p>{recipient.contact?.description}</p>
              ) : (
                <p className="italic">{t("common:no_description")}</p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="mr-auto">
              {t("common:close")}
            </Button>
          </DialogClose>
          {!recipient.contact?.id && (
            <Button onClick={showCreateFromRecipientModal}>
              {t("info-button_create_contact")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
