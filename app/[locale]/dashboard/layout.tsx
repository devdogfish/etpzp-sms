import TranslationsProvider from "@/contexts/translations-provider";
import initTranslations from "@/app/i18n";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps) {
  const i18nNamespaces = ["dashboard-page", "errors", "common"];
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      {children}
    </TranslationsProvider>
  );
}
