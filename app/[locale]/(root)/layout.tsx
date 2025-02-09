"use client";

import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel, { MobileNavPanel } from "@/components/nav-panel";
import { useTheme } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
import { useLayout } from "@/contexts/use-layout";
import { fetchUserSettings } from "@/lib/db/general";
import { useEffect } from "react";
import useIsMounted from "@/hooks/use-mounted";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const { isFullscreen } = useLayout();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      console.log(
        "checking for invalid values in locastorage: ",
        localStorage.getItem("profile_color_id") == null ||
          localStorage.getItem("displayName") == null ||
          localStorage.getItem("theme") == null ||
          localStorage.getItem("themeColor") == null
      );

      if (
        localStorage.getItem("profile_color_id") == null ||
        localStorage.getItem("displayName") == null ||
        localStorage.getItem("theme") == null ||
        localStorage.getItem("themeColor") == null
      ) {
        console.log("a localstorage item was found that was undefined");

        const syncUserSettings = async () => {
          const settings = await fetchUserSettings();
          if (settings) {
            const {
              profile_color_id,
              display_name,
              dark_mode,
              primary_color_id,
              lang,
            } = settings;
            console.log(settings);

            // Profile
            // localStorage.setItem("profile_color_id", profile_color_id.toString());
            // localStorage.setItem("display_name", display_name);

            // Appearance
            // localStorage.setItem("dark_mode", dark_mode.toString());
            // localStorage.setItem("primary_color_id", primary_color_id.toString());
          }
        };
        syncUserSettings();
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
