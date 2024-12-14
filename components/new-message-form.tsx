"use client";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import SendButton from "./send-button";
import { submitMessage } from "@/lib/send-message/actions";
import { useEffect } from "react";

export default function NewMessageForm() {
  // useEffect(() => {
  //   const handleBeforeUnload = (event: Event) => {
  //     const message =
  //       "You have unsaved changes. Are you sure you want to leave this page?";
  //     event.preventDefault();
  //     event.returnValue = !!message; // For most browsers
  //     return message; // For some older browsers
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // Cleanup function to remove the event listener
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);
  return (
    <>
      <form
        action={submitMessage}
        className="flex flex-col h-[calc(100vh-var(--header-height))]"
      >
        <div className="flex flex-col px-4 mt-2">
          <Input
            type="text"
            className="h-11 rounded-none pl-5 shadow-none border-b-[1px] border-border focus-visible:border-b-ring focus-visible:ring-0 disabled:opacity-100 placeholder:text-muted-foreground"
            defaultValue="Test"
            disabled
          />
          <Input
            type="text"
            className="h-11 rounded-none pl-5 shadow-none border-b-[1px] border-border focus-visible:border-b-ring focus-visible:ring-0 placeholder:text-muted-foreground"
            name="to"
            placeholder="To"
          />
          <Input
            type="text"
            className="h-11 rounded-none pl-5 shadow-none border-b-[1px] border-border focus-visible:border-b-ring focus-visible:ring-0 placeholder:text-muted-foreground"
            name="subject"
            placeholder="Subject (optional)"
          />
        </div>
        <div className="px-4 flex-grow mt-5 mb-2">
          <Textarea
            name="message"
            className="border-none rounded-none h-full p-0 focus-visible:ring-0 shadow-none resize-none placeholder:text-muted-foreground"
            placeholder="Start writing your message"
          />
        </div>

        <Separator />
        <div className="flex p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete draft</TooltipContent>
          </Tooltip>

          <SendButton />
        </div>
      </form>
    </>
  );
}
