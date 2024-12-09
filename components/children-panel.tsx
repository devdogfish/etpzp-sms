"use client";

import { ResizablePanel } from "./ui/resizable";
import { useLayout } from "@/contexts/use-layout";

export default function ChildrenPanel({
  children,
  hasMiddleBar,
}: {
  children: Readonly<React.ReactNode>;
  hasMiddleBar?: boolean;
}) {
  const { layout, fallbackLayout } = useLayout();
  const middleBarLayout =
    Array.isArray(layout) && layout.length === 3 ? layout[3] : undefined;
  const fallbackWidth = Array.isArray(layout) ? 100 - layout[0] : fallbackLayout[0];
  return (
    <ResizablePanel
      // width at null means don't specify any width, if it has a value use that, else use fallback
      defaultSize={hasMiddleBar ? middleBarLayout : fallbackWidth}
    >
      {children}
    </ResizablePanel>
  );
}
