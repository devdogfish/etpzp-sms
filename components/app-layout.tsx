"use client";

import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel, { MobileNavPanel } from "@/components/nav-panel";
import { useTheme as useNextTheme } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
import { useLayout } from "@/contexts/use-layout";
import { useSettings } from "@/contexts/use-settings";
import TranslationsProvider from "@/contexts/translations-provider";
import Logo from "./logo";
import { useIsMobile } from "@/hooks/use-mobile";
import Account from "./shared/account";
import { useEffect } from "react";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  resources: any;
  locale: string;
  namespaces: string[];
}>;

export default function AppLayout({
  children,
  resources,
  locale,
  namespaces,
}: LayoutProps) {
  const { theme } = useNextTheme();
  const { settings } = useSettings();
  const onMobile = useIsMobile();
  const { isFullscreen } = useLayout();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      // Scroll to the anchor
      const anchor = document.querySelector(window.location.hash);
      if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []); // Empty dependency array to run only on mount

  return (
    <SkeletonTheme
      // we are adjusting loading skeleton colors for dark mode - defaults for light mode already look good
      baseColor={theme === "dark" ? "#2a2a2a" : undefined}
      highlightColor={theme === "dark" ? "#3a3a3a" : undefined}
    >
      {/* Modern layout bar here */}
      {settings.layout === "MODERN" && !isFullscreen && !onMobile && (
        <TranslationsProvider
          resources={resources}
          locale={locale}
          /* Currently account only needs navigation and common namespaces */
          namespaces={["navigation", "common"]}
        >
          <div className="w-full min-h-[var(--simple-header-height)] flex justify-between items-center border-b px-2">
            <div className="flex items-center gap-2">
              <Logo isCollapsed={onMobile} />
            </div>
            <div className="">
              <Account profilePicPosition="RIGHT" />
            </div>
          </div>
        </TranslationsProvider>
      )}
      <ResizablePanelWrapper>
        <TranslationsProvider
          /* Only wrap what's necessary with the TranslationsProvider */
          resources={resources}
          locale={locale}
          /* should be ["navigation", "modals", "common"] */
          namespaces={namespaces}
        >
          {/* error.tsx catchall file would get its translations from here, if one existed in /app/[locale]/(root)/error.tsx */}
          <NavPanel /* resizableHandle is inside here */ />
          <MobileNavPanel /* open state is managed in useLayout context */ />
        </TranslationsProvider>

        {children}
      </ResizablePanelWrapper>
    </SkeletonTheme>
  );
}
