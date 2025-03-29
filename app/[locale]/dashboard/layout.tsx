import TranslationsProvider from "@/contexts/translations-provider";
import initTranslations from "@/app/i18n";
import { SettingsProvider } from "@/contexts/use-settings";
import { getSession } from "@/lib/auth/sessions";
import UnauthorizedPage from "@/components/403";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps) {
  const i18nNamespaces = ["dashboard-page", "errors", "common", "navigation"];
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  // Prevent non-admins from viewing the admin-dashboard and display an authorization message.
  const session = await getSession();
  if (!session?.isAdmin) return <UnauthorizedPage />;

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <SettingsProvider currentLocale={locale}>{children}</SettingsProvider>
    </TranslationsProvider>
  );
}
