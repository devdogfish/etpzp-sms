"use client";
import React, { useState } from "react";
import ProfilePic from "../profile-pic";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Account({ isCollapsed }: { isCollapsed?: boolean }) {
  const { t } = useTranslation();
  const { session, loading } = useSession();
  const [{ displayName, colorId }, setSettings] = useState({
    displayName: localStorage.getItem("display_name") || undefined,
    colorId: Number(localStorage.getItem("profile_color_id")) || undefined,
  });
  const onMobile = useIsMobile();

  return (
    <>
      <ProfilePic
        size={9}
        name={displayName}
        colorId={colorId}
        loading={loading}
      />
      <div
        className={cn(
          "flex flex-col items-start",
          (isCollapsed || onMobile) && "hidden"
        )}
      >
        <p className="font-semibold mb-[-3px]">
          {displayName || t("common:no_name")}
        </p>
        <span className="text-xs text-muted-foreground">
          {session?.isAdmin ? t("common:admin") : t("common:user")}
        </span>
      </div>
    </>
  );
}
