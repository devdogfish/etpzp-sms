"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Menu } from "lucide-react";
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
import { cn } from "@/lib/utils";
import Account from "./account";
import { Separator } from "./ui/separator";
import NavLinks from "./nav-links";
import { useTranslation } from "react-i18next";
import { useLayout } from "@/contexts/use-layout";
import { ScrollArea } from "./ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import useLanguage from "@/hooks/use-language";

export default function NavPanel({
  navCollapsedSize,
}: {
  navCollapsedSize: number;
}) {
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
        <NavPanelContent isCollapsed={isCollapsed} />
      </ResizablePanel>
      <ResizableHandle withHandle className={cn(onMobile && "hidden")} />
    </>
  );
}

export function MobileNavPanel() {
  const { mobileNavPanel, setMobileNavPanel } = useLayout();
  const router = useRouter();

  useEffect(() => {
    setMobileNavPanel(false);
  }, [router]);

  // add a click event listener to the nav element
  const handleNavClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    // when user clicks inside of this NavPanel, we check if the element clicked is a <Link> and close the NavPanel. This is so that we can have the nice closing animation
    if (target.tagName === "A" || target.closest("a")) {
      setMobileNavPanel(false);
    }
  }, []);

  return (
    <Sheet
      open={mobileNavPanel}
      onOpenChange={setMobileNavPanel}
      /* You can change the animation duration inside the shadCn component (easiest way) */
    >
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav onClick={handleNavClick}>
          <NavPanelContent
            isCollapsed={false} // on mobile it will never be collapsed
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function NavPanelContent({ isCollapsed }: { isCollapsed: boolean }) {
  const { t } = useTranslation();
  const { amountIndicators } = useLayout();
  const router = useRouter();
  // We have to data sources for the user's profile:
  // 1. Sensitive information is extracted from the encrypted session
  // 2. Stuff that can be changed in the settings is encrypted from localstorage
  const { session, loading } = useSession();
  const [{ name, colorId }, setSettings] = useState({
    name: localStorage.getItem("display_name") || undefined,
    colorId: Number(localStorage.getItem("profile_color_id")) || undefined,
  });
  const { normalizePath } = useLanguage();

  useEffect(() => {
    // Function to handle settings localstorage changes
    const handleStorageChange = () => {
      setSettings({
        name: localStorage.getItem("display_name") || undefined,
        colorId: Number(localStorage.getItem("profile_color_id")) || undefined,
      });
    };

    // Listen for our custom event settings update event
    window.addEventListener("settingsUpdated", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("settingsUpdated", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    router.push("/logout");
  };
  return (
    <>
      <div
        className={cn(
          "flex h-[var(--header-height)] items-center justify-center",
          isCollapsed ? "h-[var(--header-height)]" : "px-2"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex gap-3 items-center justify-start w-full",
              isCollapsed && "w-9 h-9"
            )}
          >
            <Account size={9} name={name} colorId={colorId} loading={loading} />
            <div
              className={cn(
                "flex flex-col items-start",
                isCollapsed && "hidden"
              )}
            >
              <p className="font-semibold mb-[-3px]">{name || "No name"}</p>
              <span className="text-xs">
                {session?.isAdmin ? "Admin" : "User"}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="z-[1000]">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup> */}
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Report a bug</DropdownMenuItem>
            {/* </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              label:
                amountIndicators?.sent == 0
                  ? ""
                  : amountIndicators?.sent.toString(),
              icon: MailCheck,
              variant: "ghost",
              href: "/sent",
            },
            {
              title: t("SCHEDULED"),
              label:
                amountIndicators?.scheduled == 0
                  ? ""
                  : amountIndicators?.scheduled.toString(),
              icon: Calendar,
              variant: "ghost",
              href: "/scheduled",
            },
            {
              title: t("FAILED"),
              label:
                amountIndicators?.failed == 0
                  ? ""
                  : amountIndicators?.failed.toString(),
              icon: AlertTriangle,
              variant: "ghost",
              href: "/failed",
            },
            {
              title: t("DRAFT"),
              label:
                amountIndicators?.drafted == 0
                  ? ""
                  : amountIndicators?.drafted.toString(),
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
              label:
                amountIndicators?.trashed == 0
                  ? ""
                  : amountIndicators?.trashed.toString(),
              icon: Trash2,
              variant: "ghost",
              href: "/trash",
            },
          ]}
        />
        {/* <NavLinks
          isCollapsed={isCollapsed}
          links={[
            {
              title: t("ALL"),
              label: amountIndicators?.all == 0 ? "" : amountIndicators?.all,
              icon: Mails,
              variant: "ghost",
              href: "/all",
            },
            // {
            //   title: t("NOTIFICATION"),
            //   label: "4",
            //   icon: AlertCircle,
            //   variant: "ghost",
            //   href: "/notifications",
            // },
          ]}
        /> */}
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
        {/* <Separator />
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
        /> */}
      </ScrollArea>
    </>
  );
}
