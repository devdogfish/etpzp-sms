"use client";

import {
  CirclePlus,
  MonitorCog,
  AlertCircle,
  Settings,
  Clipboard,
  Send,
  Trash2,
  Contact2,
  Palette,
  Puzzle,
  Pencil,
  Mails,
  MailCheck,
  FileText,
} from "lucide-react";
import * as React from "react";
import { ResizablePanel } from "./ui/resizable";
import { cn, normalizePath } from "@/lib/utils";
import Account from "./account";
import { Separator } from "./ui/separator";
import NavLinks from "./nav-links";
import { useTranslation } from "react-i18next";
import { useLayout } from "@/contexts/use-layout";
import { usePathname } from "next/navigation";

interface MailProps {
  // defaultLayout?: number[] | undefined;
  // defaultCollapsed?: boolean;
  navCollapsedSize: number;
  amountIndicators: any;
}

export default function NavPanel({
  navCollapsedSize,
  amountIndicators,
}: MailProps) {
  const { layout, isCollapsed, setIsCollapsed, fallbackLayout } = useLayout();
  const { t } = useTranslation();
  const pathname = usePathname();

  //debug
  // if (!Array.isArray(layout)) {
  //   console.error("NavPanel: could not read layout from cookies");
  // } else {
  //   console.log("rendering navpanel with a width of ", layout[0], "%");
  // }
  return (
    <ResizablePanel
      defaultSize={layout ? layout[0] : fallbackLayout[0]}
      collapsedSize={navCollapsedSize}
      collapsible={true}
      minSize={13}
      maxSize={35}
      onCollapse={() => {
        setIsCollapsed(true);
        const cookieValue = JSON.stringify(true);
        const cookiePath = "/";
        document.cookie = `react-resizable-panels:collapsed=${cookieValue}; path=${cookiePath};`;
      }}
      onResize={() => {
        setIsCollapsed(false);
        const cookieValue = JSON.stringify(false);
        const cookiePath = "/";
        document.cookie = `react-resizable-panels:collapsed=${cookieValue}; path=${cookiePath};`;
      }}
      className={cn(
        isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
      )}
    >
      <div
        className={cn(
          "flex h-[var(--header-height)] items-center justify-center",
          isCollapsed ? "h-[var(--header-height)]" : "px-2"
        )}
      >
        <Account isCollapsed={isCollapsed} />
      </div>
      <Separator />
      <NavLinks
        isCollapsed={isCollapsed}
        links={[
          {
            title: t("NEW_MESSAGE"),
            label: amountIndicators[0].rows[0].count,
            icon: Pencil,
            variant: "default",
            href: "/new-message",
            size: "xl",
          },
          {
            title: t("SENT"),
            label: "",
            icon: MailCheck,
            variant: "ghost",
            href: "/sent",
          },
          {
            title: t("DRAFT"),
            label: "9",
            icon: FileText,
            variant: "ghost",
            href: "/drafts",
          },
          // {
          //   title: t("templates"),
          //   label: "",
          //   icon: Clipboard,
          //   variant: "ghost",
          //   href: "/templates",
          // },
          {
            title: t("TRASH"),
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
            title: t("ALL"),
            label: "4",
            icon: Mails,
            variant: "ghost",
            href: "/all",
          },
          {
            title: t("NOTIFICATION"),
            label: "4",
            icon: AlertCircle,
            variant: "ghost",
            href: "/notifications",
          },
        ]}
      />
      <Separator />
      <NavLinks
        isCollapsed={isCollapsed}
        links={[
          {
            title: t("SETTING"),
            label: "",
            icon: Settings,
            variant: "ghost",
            href: "/settings",
          },
          {
            title: t("CONTACT"),
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
            title: t("DASHBOARD"),
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
            title: t("COLOR_PALETTE"),
            icon: Palette,
            variant: "ghost",
            href: "/colors",
          },
          {
            title: t("COMPONENT_PREVIEW"),
            icon: Puzzle,
            variant: "ghost",
            href: "/ui",
          },
        ]}
      />
    </ResizablePanel>
  );
}
