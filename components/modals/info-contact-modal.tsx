"use client";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { ActionResponse } from "@/types/contact";

import { DialogClose } from "@/components/ui/dialog";
import { cn, getNameInitials } from "@/lib/utils";
import { useContactModals } from "@/contexts/use-contact-modals";
import { Contact, Recipient } from "@/types";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CopyButton } from "../shared/copy-button";
import { Button } from "../ui/button";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function InfoContactModal({
  recipient,
  contact,
}: {
  recipient: Recipient;
  contact: Contact | null;
}) {
  const { modal, setModal } = useContactModals();

  const onOpenChange = (value: boolean) => {
    setModal((prev) => ({ ...prev, info: value }));
  };
  console.log(contact);

  return (
    <Dialog open={modal.info} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? "Contact" : "Recipient"} info</DialogTitle>
          <DialogDescription>
            View more info about a {contact ? "contact" : "recipient"} in your
            list.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <Avatar>
                <AvatarImage
                  alt={
                    contact ? contact.name : "Selected contact profile picture"
                  }
                />
                <AvatarFallback>
                  {getNameInitials(contact?.name)}
                </AvatarFallback>
              </Avatar>
              <h2>{contact ? contact.name : "This is not yet a contact"}</h2>
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
          {contact && (
            <div className="flex gap-4 justify-between p-4 text-sm">
              <div>Description</div>
              <div>
                {contact.description ||
                  "This contact doesn't have a description"}
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
