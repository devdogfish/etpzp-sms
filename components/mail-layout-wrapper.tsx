"use client";

import { ResizablePanelGroup } from "@/components/ui/resizable";

interface MailLayoutWrapperProps {
  children: React.ReactNode;
}

export function MailLayoutWrapper({ children }: MailLayoutWrapperProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full items-stretch"
    >
      {children}
    </ResizablePanelGroup>
  );
}
