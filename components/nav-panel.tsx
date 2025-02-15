"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertTriangle,
  Calendar,
  LogOut,
  Menu,
  UserRoundPen,
} from "lucide-react";
import {
  MonitorCog,
  Settings,
  Trash2,
  Contact2,
  Pencil,
  MailCheck,
  FileText,
} from "lucide-react";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { cn } from "@/lib/utils";
import ProfilePic from "./profile-pic";
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
import { logout } from "@/lib/auth";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function NavPanel({
  navCollapsedSize,
}: {
  navCollapsedSize: number;
}) {
  const { layout, isCollapsed, setIsCollapsed, fallbackLayout, isFullscreen } =
    useLayout();
  // const onMobile = useIsMobile();
  const hidePanelClassName =
    ((isFullscreen || useIsMobile()) && "hidden") || undefined;
  return (
    <>
      <ResizablePanel
        className={cn(
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
          hidePanelClassName
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
      <ResizableHandle withHandle className={hidePanelClassName} />
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
        <SheetTitle className="sr-only">navigation Menu</SheetTitle>
        <nav onClick={handleNavClick}>
          <NavPanelContent
            isCollapsed={false} // on mobile it will never be collapsed
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

// We have to data sources for the user's profile:
// 1. Sensitive information is extracted from the encrypted session
// 2. Stuff that can be changed in the settings is encrypted from localstorage
function NavPanelContent({ isCollapsed }: { isCollapsed: boolean }) {
  const { t } = useTranslation();
  const { amountIndicators } = useLayout();
  const router = useRouter();
  const { session, loading } = useSession();
  const [{ displayName, colorId }, setSettings] = useState({
    displayName: localStorage.getItem("display_name") || undefined,
    colorId: Number(localStorage.getItem("profile_color_id")) || undefined,
  });
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const showAlertDialog = () => {
    // show the alert dialog
    setConfirmLogoutOpen(true)
  };

  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      router.push("/login");
      localStorage.clear();
    } else
      toast.error("Error occurred", {
        description: "You weren't logged out because of an error.",
      });
  };

  // Update components when localstorage settings change
  useEffect(() => {
    const handleStorageChange = () => {
      const storedProfileColorId =
        Number(localStorage.getItem("profile_color_id")) || undefined;
      setSettings({
        displayName: localStorage.getItem("display_name") || undefined,
        colorId: storedProfileColorId,
      });
    };

    // Listen for our custom event settings update event
    window.addEventListener("settingsUpdated", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("settingsUpdated", handleStorageChange);
    };
  }, []);
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
            <ProfilePic
              size={9}
              name={displayName}
              colorId={colorId}
              loading={loading}
            />
            <div
              className={cn(
                "flex flex-col items-start",
                isCollapsed && "hidden"
              )}
            >
              <p className="font-semibold mb-[-3px]">
                {displayName || t("common:no_name")}
              </p>
              <span className="text-xs text-muted-foreground">
                {session?.isAdmin ? t("common:admin") : t("common:user")}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="z-[1000]">
            {/* <DropdownMenuLabel>My account</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup> */}
            <Link href="/settings#Profile">
              <DropdownMenuItem>
                <UserRoundPen />
                {t("common:edit_profile")}
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>
                <Settings />
                {t("settings")}
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard">
              <DropdownMenuItem>
                <MonitorCog />
                {t("dashboard")}
              </DropdownMenuItem>
            </Link>
            {/* </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              {t("common:log_out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <NavLinks
        isCollapsed={isCollapsed}
        links={[
          {
            title: t("new_message"),
            icon: Pencil,
            variant: "default",
            href: "/new-message",
            size: "xl",
            isNewButton: true,
          },
        ]}
      />

      <ScrollArea
      /* Maybe we need a fixed height here, but if everything works, all good. */
      >
        <div
          // In tailwind, this doesn't work, and I don't know why

          style={{
            height: `calc(100vh - 52px - 56px${isCollapsed ? " - 8px" : ""})`,
            width: "100%",
          }}
          className="flex flex-col"
        >
          <div className="grow">
            <NavLinks
              isCollapsed={isCollapsed}
              links={[
                {
                  title: t("sent"),
                  label:
                    amountIndicators?.sent == 0
                      ? ""
                      : amountIndicators?.sent.toString(),
                  icon: MailCheck,
                  variant: "ghost",
                  href: "/sent",
                },
                {
                  title: t("scheduled"),
                  label:
                    amountIndicators?.scheduled == 0
                      ? ""
                      : amountIndicators?.scheduled.toString(),
                  icon: Calendar,
                  variant: "ghost",
                  href: "/scheduled",
                },
                {
                  title: t("failed"),
                  label:
                    amountIndicators?.failed == 0
                      ? ""
                      : amountIndicators?.failed.toString(),
                  icon: AlertTriangle,
                  variant: "ghost",
                  href: "/failed",
                },
                {
                  title: t("drafts"),
                  label:
                    amountIndicators?.drafted == 0
                      ? ""
                      : amountIndicators?.drafted.toString(),
                  icon: FileText,
                  variant: "ghost",
                  href: "/drafts",
                },
                {
                  title: t("trash"),
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
                {
                  title: t("dashboard"),
                  label: "",
                  icon: MonitorCog,
                  variant: "ghost",
                  href: "/dashboard",
                  hidden: !session?.isAdmin,
                },
              ]}
            />
          </div>

          <div className="shrink">
            <Separator />

            <NavLinks
              isCollapsed={isCollapsed}
              links={[
                {
                  title: t("common:log_out"),
                  label: "",
                  icon: LogOut,
                  variant: "ghost",
                  action: showAlertDialog,
                },
              ]}
            />

            {/* Confirm logout dialog */}
            <AlertDialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log Out</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? No data will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common:cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    {t("common:continue")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
