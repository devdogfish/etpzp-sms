"use client";

import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel, { MobileNavPanel } from "@/components/nav-panel";
import { useTheme as useNextTheme } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
import { useLayout } from "@/contexts/use-layout";
import { useEffect } from "react";
import useIsMounted from "@/hooks/use-mounted";
import { useSettings } from "@/contexts/use-settings";
import TranslationsProvider from "@/contexts/translations-provider";
import Logo from "./logo";
import { useIsMobile } from "@/hooks/use-mobile";
import Account from "./shared/account";

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
  const isMounted = useIsMounted();
  const { theme } = useNextTheme();
  const { settings, syncWithDB, hasLanguageCookie } = useSettings();
  const onMobile = useIsMobile();

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
      {settings.layout === "MODERN" && (
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
