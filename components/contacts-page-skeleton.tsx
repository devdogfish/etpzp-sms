"use client";

import React from "react";
import ChildrenPanel from "./shared/children-panel";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageHeader } from "./headers";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Button } from "./ui/button";
import { ArrowLeft, Edit, Share, Trash2, X } from "lucide-react";

export default function ContactsPageSkeleton() {
  const { layout, fallbackLayout, amountIndicators } = useLayout();
  const { t } = useTranslation(["contacts-page", "common"]);
  const onMobile = useIsMobile();
  const selected = null;
  const skeletonsAmount: number =
    typeof amountIndicators?.contacts === "number"
      ? amountIndicators?.contacts
      : 4;
  return (
    <>
      <ResizablePanel
        className={cn(onMobile && selected !== null && "hidden")} // If we are on mobile and a message is selected we only want to show the column containing the selected message.
        // Check if the layout is a 3-column middle-bar panel. Use the previous 3-column layout if available; otherwise, render the fallback for different or undefined layouts.
        defaultSize={
          Array.isArray(layout) && layout.length === 3
            ? layout[1]
            : fallbackLayout[1]
        }
        minSize={22}
        maxSize={50}
      >
        <PageHeader title={t(`header`)} />

        <div className="rounded-md p-4 h-[68px]">
          <Skeleton className="h-9" style={{ borderRadius: "0.375rem" }} />
        </div>

        <div className="flex flex-col gap-2 p-4 pt-0 mt-2 overflow-hidden">
          {skeletonsAmount > 0 ? (
            // Math.min() makes it so that the maximum will be x, even if the variable has a larger number
            Array.from({ length: Math.min(skeletonsAmount, 10) }).map(
              (_, i) => {
                return <ContactSkeleton key={i} />;
              }
            )
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Skeleton className="w-full" />
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className={cn(onMobile && "hidden")} />
      <ChildrenPanel
        hasMiddleBar
        className={cn(onMobile && selected === null && "hidden")} // like above we are using reverse logic here. If we are on mobile, and nothing is selected, this component should not be displayed.
      >
        <ContactDisplaySkeleton />
      </ChildrenPanel>
    </>
  );
}

function ContactSkeleton() {
  return (
    <div
      className={cn(
        "flex contacts-start items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all"
      )}
    >
      <Skeleton circle width={48} height={48} />
      <div className="w-1/2 space-y-1">
        <div className="w-1/4 font-semibold">
          <Skeleton />
        </div>
        <div className="w-2/3 text-xs font-medium">
          <Skeleton />
        </div>
      </div>
    </div>
  );
}

function ContactDisplaySkeleton() {
  const onMobile = useIsMobile();
  const { t } = useTranslation(["contacts-page"]);

  return (
    <div className={cn("flex h-full flex-col")}>
      <div className="flex items-center p-2 h-[var(--header-height)] border-b">
        <div className="flex items-center gap-2">
          {onMobile && (
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{t("common:go_back")}</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" disabled>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t("common:delete_permanently")}</span>
          </Button>

          <Button variant="ghost" size="icon" disabled>
            <Share className="h-4 w-4" />
            <span className="sr-only">{t("common:export")}</span>
          </Button>

          <Button variant="ghost" size="icon" disabled>
            <Edit className="h-4 w-4" />
            <span className="sr-only">{t("common:edit")}</span>
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("common:close")}</span>
          </Button>
        </div>
      </div>

      <div className="p-8 text-center text-muted-foreground">
        {t("none_selected")}
      </div>
    </div>
  );
}
