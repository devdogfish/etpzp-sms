import Link from "next/link";
import initTranslations from "@/app/i18n";

const i18Namespaces = ["AboutUs", "Common"];

export default async function Outside({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, i18Namespaces);

  const username = "Luigi";
  return (
    <main>
      <h1>{t("header")}</h1>
      <p>{t("greeting", { username })}</p>
      <Link href="/">{t("cta")}</Link>
    </main>
  );
}
