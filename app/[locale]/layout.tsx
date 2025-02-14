import TranslationsProvider from "@/contexts/translations-provider";
import initTranslations from "@/app/i18n";

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppLayout({ children, params }: RootLayoutProps) {
  const i18nNamespaces = ["Navigation", "Common Words", "Titles", "login"];
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
