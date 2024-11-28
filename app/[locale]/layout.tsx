import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LanguageChanger from "@/components/LanguageChanger";
import { i18nConfig } from "@/i18nConfig";
import { dir } from "i18next";
import TranslationsProvider from "../providers/TranslationsProvider";
import initTranslations from "../i18n";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import ThemeProvider from "@/contexts/theme-data-provider";
import { ThemeColorChanger } from "@/components/ThemeColorChanger";
import ThemeModeChanger from "@/components/ThemeModeChanger";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const i18Namespaces = ["Home", "Common"];

export const metadata: Metadata = {
  title: "Hello World",
  description: "Created by me",
};
export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18Namespaces);
  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18Namespaces}
    >
      <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
        {/* <head></head> */}
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
        >
          <NextThemesProvider // this needs to wrap the ThemeProvider if you want to use useTheme context hook
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeProvider>
              <header>
                <nav className="flex justify-between items-center py-[10px] px-[15px] light:bg-primary-foreground gap-x-1 ">
                  HEADER
                  <div className="w-full" />
                  <LanguageChanger />
                  <ThemeColorChanger />
                  <ThemeModeChanger />
                </nav>
              </header>

              {children}

              <footer>FOOTER</footer>
            </ThemeProvider>
          </NextThemesProvider>
        </body>
      </html>
    </TranslationsProvider>
  );
}
