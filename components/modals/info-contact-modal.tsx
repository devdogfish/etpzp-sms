"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { ActionResponse, DBContact } from "@/types/contact";

import { DialogClose } from "@/components/ui/dialog";
import { cn, getNameInitials } from "@/lib/utils";
import { useContactModals } from "@/contexts/use-contact-modals";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CopyButton } from "../shared/copy-button";
import { Button } from "../ui/button";
import { NewRecipient } from "@/types/recipient";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function InfoContactModal({
  recipient,
}: {
  recipient: NewRecipient;
}) {
  const { modal, setModal } = useContactModals();

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
            View more info about a{" "}
            {recipient.contactId ? "recipient.contactId" : "recipient"} in your
            list.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <Avatar>
                <AvatarImage
                  alt={
                    recipient.contactName ||
                    "Selected recipient.contactId profile picture"
                  }
                />
                <AvatarFallback>
                  {getNameInitials(recipient.contactName)}
                </AvatarFallback>
              </Avatar>
              <h2>
                {recipient.contactName ||
                  "This is not yet a recipient.contactId"}
              </h2>
            </div>
          </div>
          <Separator />
          <div className="flex gap-4 justify-between items-center p-4 text-sm">
            <div>Phone</div>
            <div>{recipient.phone}</div>
            <div>
              <CopyButton text={recipient.phone} variant="ghost">
                Copy
              </CopyButton>
            </div>
          </div>
          <Separator />
          {recipient.contactId && (
            <div className="flex gap-4 justify-between p-4 text-sm">
              <div>Description</div>
              <div>
                {recipient.contactDescription ||
                  "This recipient.contactId doesn't have a description"}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
