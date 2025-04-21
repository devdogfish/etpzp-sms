"use client";

import { ResizablePanelGroup } from "@/components/ui/resizable";
import { useLayout } from "@/contexts/use-layout";

export default function ResizablePanelWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { setLayout } = useLayout();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        setLayout(sizes);
        const cookieValue = JSON.stringify(sizes);
        const cookiePath = "/"; // Specify a url path. The layout should be the same, no matter where it got saved.
        document.cookie = `react-resizable-panels:layout:mail=${cookieValue}; path=${cookiePath};`;
      }}
      className="h-full items-stretch"
    >
      {children}
    </ResizablePanelGroup>
  );
}
