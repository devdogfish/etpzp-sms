import initTranslations from "@/app/[locale]/i18n";
import PageHeader from "@/components/page-header";
import {
  LanguageChanger,
  ThemeModeToggle,
  ThemeColorChanger,
} from "@/components/settings";

export default async function Settings({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["Navigation"]);

  return (
    <>
      <PageHeader title={t("SETTING")} />
      <div className="p-4 space-y-8">
        <LanguageChanger />
        <ThemeColorChanger />
        <ThemeModeToggle />
      </div>
    </>
  );
}
