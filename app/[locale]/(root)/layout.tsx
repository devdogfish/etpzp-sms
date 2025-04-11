import initTranslations from "@/app/i18n";
import AppLayout from "@/components/app-layout";
import { SettingsProvider } from "@/contexts/use-settings";
import { METADATA_APP_NAME } from "@/global.config";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function NavPanelLayout({
  children,
  params,
}: LayoutProps) {
  // Internationalization (i18n) stuff - no need to include errors namespace as we only put in more specific locations
  const i18nNamespaces = ["navigation", "welcome-page", "modals", "common"];
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <SettingsProvider currentLocale={locale}>
      <AppLayout
        /* This is a client layout component containing the translation provider for the nav panel */
        resources={resources}
        locale={locale}
        namespaces={i18nNamespaces}
      >
        {children}
      </AppLayout>
    </SettingsProvider>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["metadata"]);

  return {
    title: METADATA_APP_NAME + t("welcome-title"),
    description: t("welcome-description"),
  };
}
