"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
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
import { Button, buttonVariants } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { createContact } from "@/lib/actions/contact.actions";
import { CircleAlert, Loader2 } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { cn, convertToRecipient, toastActionResult } from "@/lib/utils";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { useContactModals } from "@/contexts/use-contact-modals";
import { ActionResponse } from "@/types/action";
import { ContactSchema } from "@/lib/form.schemas";
import { useNewMessage } from "@/contexts/use-new-message";
import { NewRecipient } from "@/types/recipient";
import { DBContact } from "@/types/contact";
import useIsMounted from "@/hooks/use-mounted";
import { useTranslation } from "react-i18next";

export type CreateContactActionResponse<T> = {
  success: boolean;
  message: string[];
  data?: DBContact;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: {
    [K in keyof T]?: string;
  };
};
const initialState: CreateContactActionResponse<z.infer<typeof ContactSchema>> =
  {
    success: false,
    message: [],
  };

export default function CreateContactFromRecipientModal({
  recipient,
}: {
  recipient?: NewRecipient;
}) {
  const isMounted = useIsMounted();
  const { modal, setModal } = useContactModals();
  const [serverState, action, pending] = useActionState(
    createContact,
    initialState
  );
  const { removeRecipient, getValidatedRecipient } = useNewMessage();
  const { t } = useTranslation(["modals"]);

  useEffect(() => {
    if (isMounted) {
      toastActionResult(serverState);

      if (serverState.success) {
        onOpenChange(false);

        if (recipient && serverState.data) {
          // Replacing original recipient with newly created contact
          const newRecipient = convertToRecipient(serverState.data);
          removeRecipient(recipient, getValidatedRecipient(newRecipient));
        }
      }
    }
  }, [serverState]);

  const onOpenChange = (value: boolean) => {
    clearServerState();
    setModal((prev) => ({ ...prev, createFromRecipient: value }));
  };

  // This is unfortunately the easiest way to reset this shit
  const clearServerState = () => {
    serverState.errors = undefined;
    serverState.message = [];
    serverState.inputs = {};
  };
  return (
    <Dialog
      /* We do need these shits unfortunately */
      open={modal.createFromRecipient}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Contact</DialogTitle>
          <DialogDescription>Add a new contact to your list.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              placeholder={t("name_placeholder")}
              defaultValue={serverState.inputs?.name}
              // required
              // minLength={5}
              // maxLength={100}
              aria-describedby="name-error"
              className={serverState.errors?.name ? "border-red-500" : ""}
            />
            {serverState.errors?.name && (
              <p id="name-error" className="text-sm text-red-500">
                {serverState.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              name="phone"
              id="phone"
              placeholder={t("phone_placeholder")}
              defaultValue={serverState.inputs?.phone || recipient?.phone}
              // required
              // minLength={5}
              // maxLength={100}
              aria-describedby="phone-error"
              className={serverState.errors?.phone ? "border-red-500" : ""}
            />
            {serverState.errors?.phone && (
              <p id="phone-error" className="text-sm text-red-500">
                {serverState.errors.phone[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("common:description")}</Label>
            <Textarea
              name="description"
              id="description"
              placeholder={t("description_placeholder")}
              defaultValue={serverState.inputs?.description}
              // required
              // minLength={5}
              // maxLength={100}
              aria-describedby="description-error"
              className={
                serverState.errors?.description ? "border-red-500" : ""
              }
            />
            {serverState.errors?.description && (
              <p id="description-error" className="text-sm text-red-500">
                {serverState.errors.description[0]}
              </p>
            )}
          </div>

          {serverState.message.length > 0 && (
            <Alert variant={serverState.success ? "default" : "destructive"}>
              {!serverState.success && <CircleAlert className="w-4 h-4" />}
              <AlertDescription className="relative top-1">
                {serverState.message}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="mt-5">
            <DialogClose
              type="button"
              className={cn(buttonVariants({ variant: "outline" }), "mr-auto")}
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
