"use client";

import { format } from "date-fns/format";
import { ArrowLeft, Edit, Share, Trash2, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Contact } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, getNameInitials } from "@/lib/utils";
import { CopyButton } from "./shared/copy-button";
import { deleteContact } from "@/lib/actions/contact.actions";
import { toast } from "sonner";
import { useContactModals } from "@/contexts/use-contact-modals";
import EditContactModal from "./modals/edit-contact-modal";
import { useRouter } from "next/navigation";

export default function ContactDisplay({
  contact,
  reset,
}: {
  contact: Contact | null;
  reset: () => void;
}) {
  const today = new Date();
  const onMobile = useIsMobile();
  const router = useRouter();
  const { setModal } = useContactModals();
  const showEditModal = () => setModal((prev) => ({ ...prev, edit: true }));

  const handleDelete = async () => {
    if (contact) {
      const result = await deleteContact(contact.id);
      if (result.success) {
        reset();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };
  const messageContact = () => {
    if (contact) sessionStorage.setItem("new_message_contact_id", contact.id);
    router.push("/new-message");
  };
  return (
    <div className={cn("flex h-full flex-col")}>
      {contact && <EditContactModal contact={contact} />}
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          {onMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={reset}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Go back</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go back</TooltipContent>
            </Tooltip>
          )}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!contact}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip> */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!contact}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!contact}
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete contact</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete contact</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log("User wants to export a contact")}
                disabled={!contact}
              >
                <Share className="h-4 w-4" />
                <span className="sr-only">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={showEditModal}
                disabled={!contact}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {contact && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={reset}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          )}
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!contact}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <Separator />

      {contact ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={contact.name || "Selected contact image"} />
                <AvatarFallback>{getNameInitials(contact.name)}</AvatarFallback>
              </Avatar>
              <h2>{contact.name}</h2>
            </div>
            {contact.created_at && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(contact.created_at), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex gap-4 justify-between items-center p-4 text-sm">
            <div>Phone</div>
            <Button variant="link" onClick={messageContact}>
              {contact.phone}
            </Button>
            <div>
              <CopyButton text={contact.phone} variant="ghost">
                Copy
              </CopyButton>
            </div>
          </div>
          <Separator />
          <div className="flex gap-4 justify-between p-4 text-sm">
            <div>Description</div>
            <div>
              {contact.description || "This contact has no description"}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No contact selected
        </div>
      )}
    </div>
  );
}
