"use client";
import {
  CirclePlus,
  MonitorCog,
  AlertCircle,
  Settings,
  FilePen,
  Clipboard,
  Send,
  Trash2,
  Contact2,
  Palette,
  Puzzle,
  Pencil,
} from "lucide-react";
import * as React from "react";
import { ResizablePanel } from "./ui/resizable";
import { cn } from "@/lib/utils";
import Account from "./account";
import { Separator } from "./ui/separator";
import NavLinks from "./nav-links";
import { useTranslation } from "react-i18next";
import { useLayout } from "@/contexts/use-layout";

interface MailProps {
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export default function NavPanel({ navCollapsedSize }: MailProps) {
  const { layout, isCollapsed, setIsCollapsed } = useLayout();
  const { t } = useTranslation();
  return (
    <ResizablePanel
      defaultSize={layout && Number(layout[0])}
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
        <Account isCollapsed={isCollapsed} />
      </div>
      <Separator />
      <NavLinks
        isCollapsed={isCollapsed}
        links={[
          {
            title: t("new"),
            label: "",
            icon: Pencil,
            variant: "default",
            href: "/new",
            size:"xl"
          },
          {
            title: t("sent_messages"),
            label: "",
            icon: Send,
            variant: "ghost",
            href: "/",
          },
          {
            title: t("notifications"),
            label: "4",
            icon: AlertCircle,
            variant: "ghost",
            href: "/notifications",
          },
          {
            title: t("drafts"),
            label: "9",
            icon: FilePen,
            variant: "ghost",
            href: "/drafts",
          },
          {
            title: t("templates"),
            label: "",
            icon: Clipboard,
            variant: "ghost",
            href: "/templates",
          },
          {
            title: t("trash"),
            label: "",
            icon: Trash2,
            variant: "ghost",
            href: "/trash",
          },
        ]}
      />
      <Separator />
      <NavLinks
        isCollapsed={isCollapsed}
        links={[
          {
            title: t("settings"),
            label: "",
            icon: Settings,
            variant: "ghost",
            href: "/settings",
          },
          {
            title: t("contacts"),
            label: "",
            icon: Contact2,
            variant: "ghost",
            href: "/contacts",
          },
          // {
          //   title: "Admin Dashboard",
          //   label: "",
          //   icon: Shield,
          //   variant: "ghost",
          // },
          {
            title: t("admin_dashboard"),
            label: "",
            icon: MonitorCog,
            variant: "ghost",
            href: "/dashboard",
          },
        ]}
      />
      <Separator />
      <NavLinks
        isCollapsed={isCollapsed}
        links={[
          {
            title: t("color_palette"),
            icon: Palette,
            variant: "ghost",
            href: "/colors",
          },
          {
            title: t("component_preview"),
            icon: Puzzle,
            variant: "ghost",
            href: "/ui",
          },
        ]}
      />
    </ResizablePanel>
  );
}
