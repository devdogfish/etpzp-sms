import React from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../form-input";
import { ContactSchema } from "@/lib/form.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContactModal } from "@/contexts/use-contact-modal";
import { Form, FormControl } from "../ui/form";
import { createContact } from "@/lib/db/contact.actions";

export default function CreateContactModal() {
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      phone: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ContactSchema>) {
    console.log(values);

    const result = await createContact(values);
    console.log(result);
  }

  const { modal, setModal } = useContactModal();
  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-start">Create new Contact</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <Input
                name="name"
                label="Name"
                placeholder="Oliveiro Ferreira (only you will be able to see this)"
                control={form.control}
              />
              <Input
                name="phone"
                label="Phone number"
                placeholder="Enter a valid phone number with the"
                control={form.control}
              />
              <Input
                name="description"
                label="Description"
                placeholder="Brief description of who this is (only you will be able to see this)."
                control={form.control}
              />
            </div>

            <DialogFooter className="mt-3">
              <div className="flex w-full justify-between">
                <DialogClose className={buttonVariants({ variant: "outline" })}>
                  Close
                </DialogClose>
                <Button type="submit">Submit</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
