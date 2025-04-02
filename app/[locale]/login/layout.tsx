import TranslationsProvider from "@/contexts/translations-provider";
import initTranslations from "@/app/i18n";
import { SettingsProvider } from "@/contexts/use-settings";
import { METADATA_APP_NAME } from "@/global.config";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LoginLayout({ children, params }: LayoutProps) {
  const i18nNamespaces = ["login-page", "common"];
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

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

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["metadata"]);

  return {
    title: METADATA_APP_NAME + t("login-title"),
    description: t("login-description"),
  };
}
