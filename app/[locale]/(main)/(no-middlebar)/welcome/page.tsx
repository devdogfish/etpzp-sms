import initTranslations from "@/app/[locale]/i18n";
import Greeting from "@/components/example-client";

export default async function WelcomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const name = "Peter Fox";
  const { t } = await initTranslations(locale, ["Common"]);
  return (
    <>
      <h2>Server: {t("welcome", { name })}</h2>
      <h2 className="flex gap-1">
        Client:
        <Greeting />
      </h2>
    </>
  );
}
