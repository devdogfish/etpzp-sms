"use client";

import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel, { MobileNavPanel } from "@/components/nav-panel";
import { useTheme } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
import { useLayout } from "@/contexts/use-layout";
import { fetchUserSettings } from "@/lib/db/general";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const { isFullscreen } = useLayout();

  // if (false) {
  //   const syncUserSettings = async () => {
  //     const settings = await fetchUserSettings();
  //   };
  //   syncUserSettings();
  // }

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
