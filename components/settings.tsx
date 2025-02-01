"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/contexts/theme-data-provider";
import { i18nConfig } from "@/i18nConfig";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export function LanguageChanger() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation(["Navigation"]);
  const currentLocale = i18n.language;

  const handleChange = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + pathname);
    } else {
      router.push(pathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }

    router.refresh();
  };
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Language
      </label>
      <div className="relative w-max">
        <Select defaultValue={currentLocale} onValueChange={handleChange}>
          <SelectTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-[200px] appearance-none font-normal justify-between"
            )}
          >
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent className="light:bg-white">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-[0.8rem] text-muted-foreground">
        Set the font you want to use in the app.
      </p>
    </div>
  );
}

const availableThemeColors = [
  { name: "Zinc", light: "bg-zinc-900", dark: "bg-zinc-700" },
  { name: "Rose", light: "bg-rose-600", dark: "bg-rose-700" },
  { name: "Blue", light: "bg-blue-600", dark: "bg-blue-700" },
  { name: "Green", light: "bg-green-600", dark: "bg-green-500" },
  { name: "Orange", light: "bg-orange-500", dark: "bg-orange-700" },
];
export function ThemeColorChanger() {
  const { themeColor, setThemeColor } = useThemeContext();
  const { theme } = useTheme();

  const createSelectItems = () => {
    return availableThemeColors.map(({ name, light, dark }) => (
      <SelectItem key={name} value={name}>
        <div className="flex gap-2">
          <div
            className={cn(
              "w-[20px]",
              "h-[20px]",
              "rounded-full",
              theme === "light" ? light : dark
            )}
          ></div>
          <div className="text-sm">{name}</div>
        </div>
      </SelectItem>
    ));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Theme color
      </label>
      <div className="relative w-max">
        <Select
          onValueChange={(newColor) => setThemeColor(newColor as ThemeColors)}
          defaultValue={themeColor}
        >
          <SelectTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex gap-2 ring-offset-transparent focus:ring-transparent"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{createSelectItems()}</SelectContent>
        </Select>
      </div>
      <p className="text-[0.8rem] text-muted-foreground">
        Set the theme color you want to see in the app.
      </p>
    </div>
  );
}

export function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Theme
      </label>
      <p className="text-[0.8rem] text-muted-foreground">
        Select the theme for the app.
      </p>
      <div className="grid max-w-md grid-cols-2 gap-8 pt-2">
        <div onClick={() => setTheme("light")}>
          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
              <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
            </div>
          </div>
          <label className="block w-full p-2 text-center font-normal text-sm">
            Light {theme === "light" && "(active)"}
          </label>
        </div>

        <div onClick={() => setTheme("dark")}>
          <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
              <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
            </div>
          </div>
          <label className="block w-full p-2 text-center font-normal text-sm">
            Dark {theme === "dark" && "(active)"}
          </label>
        </div>
      </div>
    </div>
  );
}
