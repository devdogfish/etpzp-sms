import React, { useActionState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ContactSchema } from "@/lib/form.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContactModal } from "@/contexts/use-contact-modal";
import { Form, FormControl } from "../ui/form";
import { createContact } from "@/lib/db/contact.actions";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { ActionResponse } from "@/types/contact";

const initialState: ActionResponse = {
  success: false,
  message: "",
};
export default function CreateContactModal() {
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      phone: "",
      description: "",
    },
  });

  const [serverState, action, pending] = useActionState(
    createContact,
    initialState
  );
  useEffect(() => {
    if (serverState.success) {
      setModal(false);
      toast.success(serverState.message);
      serverState.inputs = undefined;
      serverState.errors = undefined;
      serverState.message = "";
    }
  }, [serverState]);

  const { modal, setModal } = useContactModal();
  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-start">Create new Contact</DialogTitle>
        </DialogHeader>

        <form action={action}>
          <div className="flex flex-col gap-5">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              placeholder="Oliveiro Ferreira (only you will be able to see this)"
            />
            <Label htmlFor="phone">Phone Number</Label>
            <Input name="phone" id="phone" placeholder="12345678900" />
            <Label htmlFor="description">Description</Label>
            <Input
              name="description"
              id="description"
              placeholder="Oliveiro Ferreira is a great friend of mine"
            />
          </div>

          <DialogFooter className="mt-3">
            <div className="flex w-full justify-between">
              <DialogClose className={buttonVariants({ variant: "outline" })}>
                Close
              </DialogClose>
              <Button type="submit">Create</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
