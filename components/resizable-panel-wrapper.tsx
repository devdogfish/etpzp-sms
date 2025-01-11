"use client";

import { ResizablePanelGroup } from "@/components/ui/resizable";
import { useLayout } from "@/contexts/use-layout";
import { useNavPanel } from "@/contexts/use-nav-panel";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ResizablePanelWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { setLayout } = useLayout();
  const { isExpanded, setIsExpanded } = useNavPanel();
  const isMobile = useIsMobile();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        setLayout(sizes);
        // console.log(`Saving layout cookie with new sizes: ${sizes}`);
        const cookieValue = JSON.stringify(sizes);
        const cookiePath = "/"; // Specify a url path. The layout should be the same, no matter where it got saved.
        document.cookie = `react-resizable-panels:layout:mail=${cookieValue}; path=${cookiePath};`;
      }}
      className="h-full items-stretch"
      // onClick={(e) => {
      //   if (isMobile) {
      //     // Hide the mobile navPanel when user clicks outside of it.
      //     const element = e.target as HTMLElement;

      //     console.log(element);
      //     console.log(element.tagName);

      //     // Get the mobile nav panel element
      //     const navPanel = document.getElementById("mobile-nav-panel");
      //     if (
      //       (isExpanded && navPanel && !navPanel.contains(element)) ||
      //       element.tagName === "A"
      //     ) {
      //       setIsExpanded(false);
      //     }
      //   }
      // }}
    >
      {children}
    </ResizablePanelGroup>
  );
}
