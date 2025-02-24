"use client";

import ChildrenPanel from "./shared/children-panel";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import MessageDisplay from "./message-display";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageHeader } from "./header";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AmountIndicators, CategoryEnums } from "@/types";

export default function MessagesPageSkeleton({
  category,
}: {
  category: CategoryEnums;
}) {
  const { layout, fallbackLayout, amountIndicators } = useLayout();
  const { t } = useTranslation(["messages-page", "common"]);
  const onMobile = useIsMobile();
  const selected = null;
  const skeletonsAmount: number = amountIndicators
    ? amountIndicators[category.toLowerCase() as keyof AmountIndicators]
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
        <PageHeader title={t(`header_${category.toLowerCase()}`)} />

        <div className="rounded-md p-4 h-[68px]">
          <Skeleton className="h-9" style={{ borderRadius: "0.375rem" }} />
        </div>

        <div className="flex flex-col gap-2 p-4 pt-0 mt-2 overflow-hidden">
          {skeletonsAmount > 0 ? (
            // Math.min() makes it so that the maximum will be x, even if the variable has a larger number
            Array.from({ length: Math.min(skeletonsAmount, 10) }).map(
              (_, i) => {
                return <MessageSkeleton key={i} />;
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
        <MessageDisplay message={null} reset={() => {}} category={category} />
      </ChildrenPanel>
    </>
  );
}

function MessageSkeleton() {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center h-[20px] w-full">
          <h2 className="flex-1 mr-20">
            <Skeleton />
          </h2>
          <p className="w-[15%] self-center">
            <Skeleton height={16} />
          </p>
        </div>
        <div className="text-xs font-medium w-[40%] ">
          <Skeleton />
        </div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground w-full">
        <Skeleton count={2} />
      </div>
    </div>
  );
}
