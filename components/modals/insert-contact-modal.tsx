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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "../ui/checkbox";
import { useNewMessage } from "@/contexts/use-new-message";
import { useContactModals } from "@/contexts/use-contact-modals";
import { DBContact } from "@/types/contact";

export default function InsertContactModal({
  contacts,
}: {
  contacts: DBContact[];
}) {
  const { modal, setModal } = useContactModals();
  const [selected, setSelected] = useState<DBContact[]>([]);
  const { addRecipient } = useNewMessage();

  const onInsert = () => {
    selected.forEach((contact: DBContact) => {
      // pass add each selected contact to the recipients context
      addRecipient(contact.phone, contacts);
    });

    // reset the selected table in this modal
    setSelected([]);
    // close the modal
    setInsertModal(false);
  };

  const showCreateModal = () => setModal((prev) => ({ ...prev, create: true }));
  const setInsertModal = (value: boolean) => {
    setModal((prev) => ({ ...prev, insert: value }));
  };
  return (
    <>
      <Dialog open={modal.insert} onOpenChange={setInsertModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">Insert Contacts</DialogTitle>
          </DialogHeader>
          {contacts.length ? (
            <Table>
              {/* <TableCaption>A list of your contacts.</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="flex items-center">
                    <Checkbox
                      className="w-6 h-6 rounded-md"
                      checked={selected.length === contacts.length}
                      onClick={() => {
                        selected.length === contacts.length
                          ? setSelected([])
                          : setSelected(contacts);
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => {
                  const current = selected.find(
                    (item) => item.id === contact.id
                  );
                  return (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        <Checkbox
                          className="w-6 h-6 rounded-md"
                          checked={!!current}
                          onClick={() => {
                            !!current
                              ? // it is already checked, so uncheck it:
                                setSelected((prevSelected) =>
                                  prevSelected.filter(
                                    (s) => s.id !== contact.id
                                  )
                                )
                              : // it is not checked yet, so add it to the selectedArr
                                setSelected((prevSelected) => [
                                  ...prevSelected,
                                  contact,
                                ]);
                          }}
                        />
                      </TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
                  setInsertModal(false);
                  showCreateModal();
                }}
              >
                Create new contact
              </Button>
            </div>
          )}
          <DialogFooter>
            <div className="flex w-full justify-between">
              <DialogClose
                className={cn(
                  "w-full sm:w-min",
                  buttonVariants({ variant: "outline" })
                )}
              >
                Close
              </DialogClose>
              {contacts.length !== 0 && (
                <Button disabled={!selected.length} onClick={onInsert}>
                  {selected.length === 0
                    ? `Insert ${!selected.length && "0"} contacts`
                    : selected.length === 1
                    ? `Insert contact`
                    : `Insert ${selected.length} contacts`}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
