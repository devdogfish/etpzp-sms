import LanguageChanger from "@/components/settings/LanguageChanger";
import { ThemeColorChanger } from "@/components/settings/ThemeColorChanger";
import ThemeModeChanger from "@/components/settings/ThemeModeChanger";
import { ResizablePanel } from "@/components/ui/resizable";

export default function Settings() {
  return (
    <div className="whitespace-nowrap w-full">
      <h1 className="whitespace-nowrap">
        Welcome to the Settings, <pre className="inline">{`User`}</pre>!
      </h1>
      <div className="flex flex-col">
        <LanguageChanger />
        <ThemeColorChanger />
        <ThemeModeChanger />
      </div>
    </div>
  );
}
