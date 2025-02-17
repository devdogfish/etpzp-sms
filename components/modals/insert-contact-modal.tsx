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
import { useTranslation } from "react-i18next";

export default function InsertContactModal({
  contacts,
}: {
  contacts: DBContact[];
}) {
  const { modal, setModal } = useContactModals();
  const [selected, setSelected] = useState<DBContact[]>([]);
  const { addRecipient } = useNewMessage();
  const { t } = useTranslation(["modals"]);

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
            <DialogTitle>{t("insert_contact-header")}</DialogTitle>
            <DialogDescription>
              {t("insert_contact-header_caption")}
            </DialogDescription>
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
