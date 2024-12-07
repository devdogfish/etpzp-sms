import LanguageChanger from "@/components/settings/LanguageChanger";
import { ThemeColorChanger } from "@/components/settings/ThemeColorChanger";
import ThemeModeToggle from "@/components/settings/ThemeModeToggle";
import { ResizablePanel } from "@/components/ui/resizable";

export default function Settings() {
  return (
    <ResizablePanel className="whitespace-nowrap w-full">
      <h1 className="whitespace-nowrap">
        Welcome to the Settings, <pre className="inline">{`User`}</pre>!
      </h1>
      <div className="flex flex-col">
        <LanguageChanger />
        <ThemeColorChanger />
        <ThemeModeToggle />
      </div>
    </ResizablePanel>
  );
}
