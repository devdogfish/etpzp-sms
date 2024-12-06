"use client";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  // Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";
import * as React from "react";
import { ResizablePanel } from "./ui/resizable";
import { cn } from "@/lib/utils";
import { AccountSwitcher } from "./account-switcher";
import { Separator } from "./ui/separator";
import NavLinks from "./nav-links";
interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export default function NavPanel({
  defaultCollapsed = false,
  navCollapsedSize,
  defaultLayout = [20, 32, 48],
  accounts,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  return (
    <ResizablePanel
      defaultSize={defaultLayout[0]}
      collapsedSize={navCollapsedSize}
      collapsible={true}
      minSize={13}
      maxSize={35}
      onCollapse={() => {
        setIsCollapsed(true);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          true
        )}`;
      }}
      onResize={() => {
        setIsCollapsed(false);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          false
        )}`;
      }}
      className={cn(
        isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
      )}
    >
      <div
        className={cn(
          "flex h-[52px] items-center justify-center",
          isCollapsed ? "h-[52px]" : "px-2"
        )}
      >
        <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
      </div>
      <Separator />
      <NavLinks
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Inbox",
            label: "128",
            icon: Inbox,
            variant: "default",
          },
          {
            title: "Drafts",
            label: "9",
            icon: File,
            variant: "ghost",
          },
          {
            title: "Sent",
            label: "",
            icon: Send,
            variant: "ghost",
          },
          {
            title: "Junk",
            label: "23",
            icon: ArchiveX,
            variant: "ghost",
          },
          {
            title: "Trash",
            label: "",
            icon: Trash2,
            variant: "ghost",
          },
          {
            title: "Archive",
            label: "",
            icon: Archive,
            variant: "ghost",
          },
        ]}
      />
      <Separator />
      <NavLinks
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Social",
            label: "972",
            icon: Users2,
            variant: "ghost",
          },
          {
            title: "Updates",
            label: "342",
            icon: AlertCircle,
            variant: "ghost",
          },
          {
            title: "Forums",
            label: "128",
            icon: MessagesSquare,
            variant: "ghost",
          },
          {
            title: "Shopping",
            label: "8",
            icon: ShoppingCart,
            variant: "ghost",
          },
          {
            title: "Promotions",
            label: "21",
            icon: Archive,
            variant: "ghost",
          },
        ]}
      />
    </ResizablePanel>
  );
}
