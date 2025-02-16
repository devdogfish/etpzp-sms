import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { dir } from "i18next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeProvider from "@/contexts/theme-data-provider";
import { cookies } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LayoutProvider } from "@/contexts/use-layout";
import { Toaster } from "sonner";
import { fetchAmountIndicators } from "@/lib/db/general";

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

export const metadata: Metadata = {
  title: "SMS app",
  description: "Created by me",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We can't get the locale from the url params, thus we parse it from the locale cookie
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const layoutCookie = cookieStore.get("react-resizable-panels:layout:mail");
  const collapsedCookie = cookieStore.get("react-resizable-panels:collapsed");

  const initialLayout: number[] = layoutCookie
    ? JSON.parse(layoutCookie.value)
    : undefined;
  const initialIsCollapsed: boolean = collapsedCookie
    ? JSON.parse(collapsedCookie.value)
    : undefined;

  const amountIndicators = await fetchAmountIndicators();

  return (
    <html
      lang={currentLocale}
      dir={dir(currentLocale)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
      >
        <NextThemesProvider
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
                amountIndicators={amountIndicators}
              >
                <Toaster richColors position="top-center" />
                {children}
              </LayoutProvider>
            </TooltipProvider>
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
