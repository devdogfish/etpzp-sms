import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { i18nConfig } from "@/i18nConfig";
import { dir } from "i18next";
import TranslationsProvider from "../../../providers/TranslationsProvider";
import initTranslations from "../i18n";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import ThemeProvider from "@/contexts/theme-data-provider";

import { ResizablePanelWrapper } from "@/components/mail-layout-wrapper";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import NavPanel from "@/components/nav-panel";
import { cookies } from "next/headers";
import { accounts, mails } from "@/lib/test-data.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LayoutProvider } from "@/contexts/use-layout";
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SMS app",
  description: "Created by me",
};
export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};
const i18nNamespaces = ["Home", "Common"];
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  const cookieStore = await cookies();
  const layoutCookie = cookieStore.get("react-resizable-panels:layout:mail");
  const collapsedCookie = cookieStore.get("react-resizable-panels:collapsed");

  // getting prev. sizes resizable-sidebar-panels and using it as default value
  const initialLayout: number[] = layoutCookie
    ? JSON.parse(layoutCookie.value)
    : undefined;
  const initialIsCollapsed: boolean = collapsedCookie
    ? JSON.parse(collapsedCookie.value)
    : undefined;
    console.log(`RE-FETCHED COOKIES ${initialLayout}, ${initialIsCollapsed}`)
  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
        >
          <NextThemesProvider // this needs to wrap the ThemeProvider if you want to use useTheme context hook
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeProvider>
              <TooltipProvider delayDuration={0}>
                <LayoutProvider
                  initialLayout={initialLayout}
                  initialIsCollapsed={initialIsCollapsed}
                >
                  <ResizablePanelWrapper>
                    <NavPanel navCollapsedSize={4} accounts={accounts} />
                    <ResizableHandle withHandle />

                    {children}
                  </ResizablePanelWrapper>
                </LayoutProvider>
              </TooltipProvider>
            </ThemeProvider>
          </NextThemesProvider>
        </body>
      </html>
    </TranslationsProvider>
  );
}
