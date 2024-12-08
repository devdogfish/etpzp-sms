import Header from "@/components/header";
import LanguageChanger from "@/components/settings/LanguageChanger";
import { ThemeColorChanger } from "@/components/settings/ThemeColorChanger";
import ThemeModeToggle from "@/components/settings/ThemeModeToggle";
import { ResizablePanel } from "@/components/ui/resizable";

export default function Settings() {
  return (
    <div className="p-3">
      <Header  />
      <div className="flex flex-col">
        <LanguageChanger />
        <ThemeColorChanger />
        <ThemeModeToggle />
      </div>
    </div>
  );
}
