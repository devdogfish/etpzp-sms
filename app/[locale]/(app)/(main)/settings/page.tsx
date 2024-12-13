import initTranslations from "@/app/[locale]/i18n";
import PageHeader from "@/components/page-header";
import LanguageChanger from "@/components/settings/LanguageChanger";
import { ThemeColorChanger } from "@/components/settings/ThemeColorChanger";
import ThemeModeToggle from "@/components/settings/ThemeModeToggle";
import { ResizablePanel } from "@/components/ui/resizable";

export default async function Settings({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["Navigation"]);
  return (
    <>
      <PageHeader title={t("settings")}>
        <ThemeColorChanger />
        <ThemeModeToggle />
      </PageHeader>
      <div className="p-3 flex flex-col">
        Hello Settings!
        <LanguageChanger />
        {/* <LanguageChanger />
        <ThemeColorChanger />
        <ThemeModeToggle /> */}
      </div>
    </>
  );
}
