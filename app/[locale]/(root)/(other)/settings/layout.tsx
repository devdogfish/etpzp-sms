import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/contexts/translations-provider";
import ChildrenPanel from "@/components/shared/children-panel";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function TranslationLayout({
  children,
  params,
}: LayoutProps) {
  // Internationalization (i18n) stuff
  const i18nNamespaces = ["settings-page", "common", "errors"];
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    /* This is a client layout component containing the translation provider for the nav panel */
    <TranslationsProvider
      /* Only wrap what's necessary with the TranslationsProvider */
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <ChildrenPanel>{children}</ChildrenPanel>
    </TranslationsProvider>
  );
}
