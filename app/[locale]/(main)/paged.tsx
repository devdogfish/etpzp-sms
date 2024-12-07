import Link from "next/link";
import initTranslations from "../i18n";
import ExampleClientComponent from "@/components/exampleClient";
import { Button } from "@/components/ui/button";
const i18Namespaces = ["Home", "Common"];

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, i18Namespaces);

  return (
    <div>
      <h1 className="">{t("header")}</h1>
      <ExampleClientComponent />
    </div>
  );
}
