"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { updateContact } from "@/lib/actions/contact.actions";
import { DBContact } from "@/types/contact";
import { ContactSchema } from "@/lib/form.schemas";
import {
  Badge,
  CheckCircle2,
  CircleAlert,
  FileWarning,
  Loader2,
  Server,
} from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { cn, toastActionResult } from "@/lib/utils";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { useContactModals } from "@/contexts/use-contact-modals";
import { ActionResponse } from "@/types/action";

const initialState: ActionResponse<undefined> = {
  success: false,
  message: [],
};

export default function EditContactModal({ contact }: { contact: DBContact }) {
  const { modal, setModal } = useContactModals();
  const [serverState, action, pending] = useActionState(
    updateContact.bind(null, contact.id),
    initialState
  );

  useEffect(() => {
    if (serverState.success) {
      onOpenChange(false);
      toastActionResult(serverState);
      serverState.inputs = undefined;
      serverState.errors = undefined;
      serverState.message = [];
    }
  }, [serverState]);

  const onOpenChange = (value: boolean) => {
    setModal((prev) => ({ ...prev, edit: value }));
  };
  return (
    <Dialog open={modal.edit} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>Edit a contact in your list.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              placeholder="Oliveiro"
              defaultValue={serverState.inputs?.name || contact.name}
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
              placeholder="1234568900"
              defaultValue={serverState.inputs?.phone || contact.phone}
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Oliveiro is a great friend of mine, I met him at the festival of the edge lords."
              defaultValue={
                serverState.inputs?.description || contact.description
              }
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

          {serverState?.message && (
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
