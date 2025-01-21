import initTranslations from "@/app/[locale]/i18n";
import PageHeader from "@/components/page-header";
import LanguageChanger from "@/components/settings/LanguageChanger";
import SettingsForm from "@/components/settings/settings-form";
import { ThemeColorChanger } from "@/components/settings/ThemeColorChanger";
import ThemeModeToggle from "@/components/settings/ThemeModeToggle";

export default async function Settings({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["Navigation"]);
  return (
    <>
      <PageHeader title={t("SETTING")}>
        <ThemeColorChanger />
        <ThemeModeToggle />
      </PageHeader>
      <div className="p-3 flex flex-col">
        Hello Settings!
        <LanguageChanger />
        <SettingsForm />
      </div>
    </>
  );
}
