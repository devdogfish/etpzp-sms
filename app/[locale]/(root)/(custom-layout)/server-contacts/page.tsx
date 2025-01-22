"use client";
import { Label } from "@/components/ui/label";
import { createContact } from "@/lib/actions/contact.actions";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { ActionResponse } from "@/types/contact";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function Page() {
  const [serverState, action, pending] = useActionState(
    createContact,
    initialState
  );

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          placeholder="Oliveiro"
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
          placeholder="1234568900"
          defaultValue={serverState.inputs?.phone}
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
          defaultValue={serverState.inputs?.description}
          // required
          // minLength={5}
          // maxLength={100}
          aria-describedby="description-error"
          className={serverState.errors?.description ? "border-red-500" : ""}
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

      <div className="mt-5">
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }), "mr-auto")}
        >
          Cancel
        </button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Submit
        </Button>
      </div>
    </form>
  );
}
