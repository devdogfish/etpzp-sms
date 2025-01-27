"use client";
import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel, { MobileNavPanel } from "@/components/nav-panel";
import { useTheme } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
import { cn } from "@/lib/utils";
import { useLayout } from "@/contexts/use-layout";

type MainLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function MainLayout({ children, params }: MainLayoutProps) {
  const { theme } = useTheme();
  const { isFullscreen } = useLayout();
  return (
    <SkeletonTheme
      // we are adjusting loading skeleton colors for dark mode - defaults for light mode already look good
      baseColor={theme === "dark" ? "#2a2a2a" : undefined}
      highlightColor={theme === "dark" ? "#3a3a3a" : undefined}
    >
      {!isFullscreen ? (
        <ResizablePanelWrapper>
          <NavPanel navCollapsedSize={4} /* resizableHandle is inside here */ />
          <MobileNavPanel /* the open state is managed in useLayout context */
          />

          {children}
        </ResizablePanelWrapper>
      ) : (
        <>{children}</>
      )}
    </SkeletonTheme>
  );
}
