"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { cn, normalizePath } from "@/lib/utils";
import Account from "./account";
import { Separator } from "./ui/separator";
import NavLinks from "./nav-links";
import { useTranslation } from "react-i18next";
import { useLayout } from "@/contexts/use-layout";
import { ScrollArea } from "./ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname, useRouter } from "next/navigation";

type NavPanelProps = {
  // defaultLayout?: number[] | undefined;
  // defaultCollapsed?: boolean;
  navCollapsedSize: number;
  amountIndicators?: {
    sent: string;
    drafts: string;
    trash: string;
    all: string;
  };
};

export default function NavPanel({
  navCollapsedSize,
  amountIndicators,
}: NavPanelProps) {
  const { t } = useTranslation();
  const { layout, isCollapsed, setIsCollapsed, fallbackLayout } = useLayout();
  const onMobile = useIsMobile();

  return (
    <>
      <ResizablePanel
        className={cn(
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
          onMobile && "hidden"
        )}
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
      >
        <NavPanelContent
          navCollapsedSize={navCollapsedSize}
          amountIndicators={amountIndicators}
          isCollapsed={isCollapsed}
        />
      </ResizablePanel>
      <ResizableHandle withHandle className={cn(onMobile && "hidden")} />
    </>
  );
}

export function MobileNavPanel({ navCollapsedSize }: NavPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  // we added an click event listener to the nav element
  const handleNavClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    // when user clicks inside of this NavPanel, we check if the element clicked is a <Link> and close the NavPanel. This is so that we can have the nice closing animation
    if (target.tagName === "A" || target.closest("a")) {
      setIsOpen(false);
    }
  }, []);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} /* You can change the animation duration inside the shadCn component (easiest way) */>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav onClick={handleNavClick}>
          <NavPanelContent
            navCollapsedSize={navCollapsedSize}
            isCollapsed={false} // on mobile it will never be collapsed
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function NavPanelContent({
  navCollapsedSize,
  amountIndicators,
  isCollapsed,
}: NavPanelProps & { isCollapsed: boolean }) {
  const { t } = useTranslation();
  return (
    <>
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
            icon: Pencil,
            variant: "default",
            href: "/new-message",
            size: "xl",
          },
        ]}
      />

      <ScrollArea className="h-[calc(100vh-52px-56px)]">
        <NavLinks
          isCollapsed={isCollapsed}
          links={[
            {
              title: t("SENT"),
              label: amountIndicators?.sent,
              icon: MailCheck,
              variant: "ghost",
              href: "/sent",
            },
            {
              title: t("DRAFT"),
              label: amountIndicators?.drafts,
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
              label: amountIndicators?.trash,
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
              label: amountIndicators?.all,
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
      </ScrollArea>
    </>
  );
}
