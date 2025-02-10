"use client";

import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel, { MobileNavPanel } from "@/components/nav-panel";
import { useTheme as useNextTheme } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
import { useLayout } from "@/contexts/use-layout";
import { useEffect } from "react";
import useIsMounted from "@/hooks/use-mounted";
import { useThemeContext } from "@/contexts/theme-data-provider";
import useLanguage from "@/hooks/use-language";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useNextTheme();
  const { syncWithDB } = useThemeContext();
  const { isFullscreen } = useLayout();
  const isMounted = useIsMounted();
  const { hasLanguageCookie } = useLanguage();

  useEffect(() => {
    if (isMounted) {
      if (
        localStorage.getItem("profile_color_id") == null ||
        localStorage.getItem("display_name") == null ||
        localStorage.getItem("primary_color_id") == null ||
        localStorage.getItem("theme") == null ||
        hasLanguageCookie() === false
      ) {
        syncWithDB();
      }
    }
  }, [isMounted]);

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
