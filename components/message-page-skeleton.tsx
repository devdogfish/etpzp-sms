"use client";
import React, { ChangeEvent, useCallback, useState } from "react";
import ChildrenPanel from "./children-panel";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import { useTranslation } from "react-i18next";

import { cn, searchMessages } from "@/lib/utils";
import { MessageDisplay } from "./message-display";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "./page-header";
import { Search } from "lucide-react";
// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export default function MessagesPageSkeleton({
  location,
}: {
  location: string;
}) {
  const { layout, fallbackLayout } = useLayout();
  const { t, i18n } = useTranslation(["Common Words"]);
  const onMobile = useIsMobile();
  const selected = null;
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
        {/** HOW CAN I GET THIS FUCKING SHIMMER TO WORK */}
        <PageHeader title={t(location)}></PageHeader>
        <div className={`${shimmer} p-4 relative`}>
          <div className="relative">
            {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /> */}
            <div
              className={` h-9 bg-gray-100 rounded-md pl-8 placeholder:text-muted-foreground border`}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className={cn(onMobile && "hidden")} />
      <ChildrenPanel
        hasMiddleBar
        className={cn(onMobile && selected === null && "hidden")} // like above we are using reverse logic here. If we are on mobile, and nothing is selected, this component should not be displayed.
      >
        <MessageDisplay message={null} />
      </ChildrenPanel>
    </>
  );
}
