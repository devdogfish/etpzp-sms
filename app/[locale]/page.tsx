import Link from "next/link";
import initTranslations from "../i18n";
import ExampleClientComponent from "@/app/components/exampleClient";
import TranslationsProvider from "@/app/providers/TranslationsProvider";

const i18Namespaces = ["Home", "Common"];

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18Namespaces);
  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18Namespaces}
    >
      <main>
        <h1>{t("header")}</h1>
        <ExampleClientComponent />
        <Link href="/outside">{t("cta")}</Link>
      </main>
    </TranslationsProvider>
  );
}
