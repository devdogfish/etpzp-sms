import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogPortal,
  DialogClose,
} from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import CreateContactModal from "./create-contact-modal";
import { useContactModal } from "@/contexts/use-contact-modal";
import { Contact } from "@/types/contact";

export default function InsertContactModal({
  children,
  contacts,
}: Readonly<{ children: React.ReactNode; contacts: ActionResult<Contact[]> }>) {
  const [open, setOpen] = useState(false);
  console.log(contacts.success);
  console.log(contacts);

  const { setModal } = useContactModal();
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">Insert Contacts</DialogTitle>
          </DialogHeader>
          {contacts.success === true ? (
            <div className="flex flex-col gap-2">
              {contacts.data.map((contact: Contact) => (
                <div key={contact.id} className="bg-muted">{contact.name}</div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <DialogDescription className="self-start sm:self-center">
                You don't have any contacts yet. Start by creating a new contact
                first
              </DialogDescription>
              <div className="">CONTACT IMAGE</div>
              <Button
                className="w-min"
                onClick={() => {
                  setOpen(false);
                  setModal(true);
                }}
              >
                Create new contact
              </Button>
            </div>
          )}
          <DialogFooter>
            <div className="flex w-full">
              <DialogClose
                className={cn(
                  "w-full sm:w-min",
                  buttonVariants({ variant: "outline" })
                )}
              >
                Close
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
