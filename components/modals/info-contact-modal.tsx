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
import { cn, getNameInitials } from "@/lib/utils";
import { useContactModals } from "@/contexts/use-contact-modals";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CopyButton } from "../shared/copy-button";
import { Button } from "../ui/button";
import { NewRecipient } from "@/types/recipient";
import { useTranslation } from "react-i18next";

export default function InfoContactModal({
  recipient,
}: {
  recipient: NewRecipient;
}) {
  const { modal, setModal } = useContactModals();
  const { t} = useTranslation(["modals"])

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
            {recipient.contactId ? "Contact" : "Recipient"} info
          </DialogTitle>
          <DialogDescription>
            View more info about a
            {recipient.contactId ? " contact" : " recipient"} of the new
            message.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <Avatar>
                <AvatarImage
                  alt={
                    recipient.contactName || "Selected contact profile picture"
                  }
                />
                <AvatarFallback>
                  {getNameInitials(recipient.contactName)}
                </AvatarFallback>
              </Avatar>
              <h2>{recipient.contactName || "This is not yet a contact"}</h2>
            </div>
          </div>
          <Separator />
          <div className="flex gap-4 justify-between items-center p-4 text-sm">
            <div>Phone</div>
            <CopyButton text={recipient.phone} variant="none">
              {recipient.phone}
            </CopyButton>
          </div>
          <Separator />
          {recipient.contactId && (
            <div className="flex gap-4 justify-between p-4 text-sm">
              <div>{t("common:description")}</div>
              <div>
                {recipient.contactDescription ||
                  t("common:no_description")}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="mr-auto">
              Close
            </Button>
          </DialogClose>
          {!recipient.contactId && (
            <Button className="" onClick={showCreateFromRecipientModal}>
              Create
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
