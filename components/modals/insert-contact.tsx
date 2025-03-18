"use client";

import { useEffect, useState } from "react";
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
import { useModal } from "@/contexts/use-modal";
import { DBContact } from "@/types/contact";
import { useTranslation } from "react-i18next";
import { useContacts } from "@/contexts/use-contacts";

export default function InsertContactModal() {
  const { contacts } = useContacts();
  const { modal, setModal } = useModal();
  const { addRecipient, showInfoAbout, message, removeRecipient } =
    useNewMessage();
  const initialSelected: DBContact[] = [];
  message.recipients.forEach((r) => {
    const contactInMessage = contacts.find((c) => c.phone === r.phone);
    if (contactInMessage) initialSelected.push(contactInMessage);
  });

  const [selected, setSelected] = useState<DBContact[]>(initialSelected);
  const { t } = useTranslation(["modals", "common"]);

  // Only those contacts that are selected here should be inside the message object
  const onInsert = () => {
    // 1. Remove the ones from the message that were deselected here
    const deselectedContacts = contacts.filter(
      (contact) =>
        !selected.some((selectedContact) => selectedContact === contact)
    );
    message.recipients.map((recipient) => {
      if (deselectedContacts.find((c) => c.phone === recipient.phone)) {
        removeRecipient(recipient);
      }
    });

    // 2. Add the ones that don't exist yet.
    const contactsNotInMessage = contacts.filter(
      (contact) =>
        !message.recipients.some(
          (messageContact) => messageContact.phone === contact.phone
        )
    );

    selected.forEach((selectedContact: DBContact) => {
      // pass add each selected selectedContact to the recipients context
      if (
        contactsNotInMessage.find(
          (notContact) => notContact.phone === selectedContact.phone
        )
      ) {
        addRecipient(selectedContact.phone, contacts);
      }
    });

    // close the modal
    setInsertModal(false);
  };

  const showCreateModal = () => {
    showInfoAbout(null);
    setModal((m) => ({ ...m, contact: { ...m.contact, create: true } }));
  };
  const setInsertModal = (value: boolean) => {
    setModal((m) => ({ ...m, contact: { ...m.contact, insert: value } }));
  };

  useEffect(() => {
    if (modal.contact.insert) setSelected(initialSelected);
  }, [modal.contact.insert]);
  return (
    <>
      <Dialog open={modal.contact.insert} onOpenChange={setInsertModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("insert_contact-header")}</DialogTitle>
            <DialogDescription>
              {t("insert_contact-header_caption")}
            </DialogDescription>
            {/* DEBUG */}
            {/* <Button onClick={showCreateModal}>Create new</Button> */}
          </DialogHeader>
          {contacts.length ? (
            <div className="max-h-[400px] overflow-auto">
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
                    <TableHead>{t("common:name")}</TableHead>
                    <TableHead>{t("common:phone_number")}</TableHead>
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
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <DialogDescription className="self-start sm:self-center text-center text-red-400">
                {t("insert_contact-no_contacts")}
              </DialogDescription>
              <Button
                className="w-min"
                onClick={() => {
                  setInsertModal(false);
                  showCreateModal();
                }}
              >
                {t("insert_contact-button_create_new")}
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
                {t("common:cancel")}
              </DialogClose>
              {contacts.length !== 0 && (
                <Button disabled={!selected.length} onClick={onInsert}>
                  {selected.length === 1
                    ? t("insert_contact-button_insert_one")
                    : t("insert_contact-button_insert_x", {
                        amount: selected.length,
                      })}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
