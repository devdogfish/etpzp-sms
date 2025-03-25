"use client";
import React, { useState } from "react";
import ProfilePic from "../profile-pic";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogOut, MonitorCog, Settings, UserRoundPen } from "lucide-react";
import { useSettings } from "@/contexts/use-settings";
import { logout } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

export default function Account({
  hideNameRole = false,
  profilePicPosition = "LEFT",
  className,
}: {
  hideNameRole?: boolean;
  profilePicPosition?: "LEFT" | "RIGHT";
  className?: string;
}) {
  const { t } = useTranslation();
  const { session, loading } = useSession();

  const pathname = usePathname();
  const router = useRouter();
  const { settings, resetLocalSettings } = useSettings();
  const onMobile = useIsMobile();

  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      resetLocalSettings();
      router.push("/login");
    }
  };
  return (
    <div
      className={cn(
        "flex h-[var(--header-header-height)] items-center justify-center", //border-b
        // !hideNameRole && "px-2"
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex gap-3 items-center justify-start w-full",
            hideNameRole && "w-9 h-9",
            profilePicPosition === "RIGHT" && "flex-row-reverse"
          )}
        >
          <ProfilePic
            size={9}
            name={settings.displayName}
            colorId={settings.profileColorId}
            loading={loading}
          />
          <div
            className={cn(
              "flex flex-col items-start",
              hideNameRole && "hidden"
            )}
          >
            <p className="font-semibold mb-[-3px]">
              {settings.displayName || t("common:account-no_name")}
            </p>
            <span className="text-xs text-muted-foreground">
              {session?.isAdmin ? t("common:admin") : t("common:user")}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={profilePicPosition === "LEFT" ? "start" : "end"}
          className="z-10"
        >
          <DropdownMenuGroup>
            <Link href="/settings#profile">
              <DropdownMenuItem>
                <UserRoundPen />
                {t("common:account-edit_profile")}
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>
                <Settings />
                {t("navigation:settings")}
              </DropdownMenuItem>
            </Link>
            {session?.isAdmin && (
              <Link href={pathname.includes("/dashboard") ? "/" : "/dashboard"}>
                <DropdownMenuItem>
                  <MonitorCog />
                  {pathname.includes("/dashboard")
                    ? t("common:account-dashboard_leave")
                    : t("common:account-dashboard_enter")}
                </DropdownMenuItem>
              </Link>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            {t("navigation:log_out")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
