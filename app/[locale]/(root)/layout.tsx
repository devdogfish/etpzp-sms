"use client";
import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel, { MobileNavPanel } from "@/components/nav-panel";
import { useTheme } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function AppLayout({ children, params }: AppLayoutProps) {
  const { theme } = useTheme();

  return (
    <SkeletonTheme /**baseColor="#202020" highlightColor="#444" */
      baseColor={theme === "dark" ? "#2a2a2a" : undefined}
      highlightColor={theme === "dark" ? "#3a3a3a" : undefined}
    >
      <ResizablePanelWrapper>
        <NavPanel navCollapsedSize={4} /* resizableHandle is inside here */ />
        <MobileNavPanel /* the open state is managed in useLayout context */ />

        {children}
      </ResizablePanelWrapper>
    </SkeletonTheme>
  );
}
