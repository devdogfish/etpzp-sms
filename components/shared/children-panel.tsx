"use client";

import { ResizablePanel } from "../ui/resizable";
import { useLayout } from "@/contexts/use-layout";

export default function ChildrenPanel({
  children,
  hasMiddleBar,
  className,
}: {
  children: Readonly<React.ReactNode>;
  hasMiddleBar?: boolean;
  className?: string;
}) {
  const { layout, fallbackLayout } = useLayout();
  const middleBarWidth =
    Array.isArray(layout) && layout.length === 3 ? layout[2] : undefined;

  const fallbackWidth = Array.isArray(layout)
    ? 100 - layout[0]
    : fallbackLayout[0];

  //debug
  if (!Array.isArray(layout)) {
    console.error("Could not parse layout from cookies");
  } else {
    console.log(
      "rendering childrenLayout with a width of ",
      hasMiddleBar ? middleBarWidth : fallbackWidth,
      "%"
    );
    console.log(`Used ${hasMiddleBar ? "middle bar width" : "fallbackWidth"}`);
    console.log(layout);
    
  }
  return (
    <ResizablePanel
      // width at null means don't specify any width, if it has a value use that, else use fallback
      defaultSize={hasMiddleBar ? middleBarWidth : fallbackWidth}
      className={className}
    >
      {children}
    </ResizablePanel>
  );
}
