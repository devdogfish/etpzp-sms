import Link from "next/link";
import initTranslations from "../i18n";
import ExampleClientComponent from "@/components/exampleClient";
import ThemeToggle from "@/components/theme-mode-toggle";
const i18Namespaces = ["Home", "Common"];

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, i18Namespaces);
  return (
    <main>
      <h1>{t("header")}</h1>
      <ExampleClientComponent />
      <ThemeToggle />
      <Link href="/outside">{t("cta")}</Link>
    </main>
  );
}
