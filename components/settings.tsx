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
import { cn } from "@/lib/utils";
import { useTheme as useNextTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { RenderInputArgs } from "@/components/settings-item";
import { useEffect, useState } from "react";
import { updateSetting } from "@/lib/actions/user.actions";
import useSettings from "@/hooks/use-setting";

export function LanguageChanger({
  // value,
  onChange,
  id,
  setServerState,
}: RenderInputArgs) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
  const { updateLanguageCookie } = useSettings(currentLocale);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleChange = async (newLocale: string) => {
    // Update the database first
    setIsPending(true);
    const formData = new FormData();
    formData.append("name", "lang");
    formData.append("value", newLocale);

    const result = await updateSetting(formData);
    if (setServerState) setServerState(result);
    setIsPending(false);

    updateLanguageCookie(newLocale);
  };
  return (
    <Select
      defaultValue={currentLocale}
      // When turning into a controlled input by passing in a value, the app breaks - I'm not sure why.
      // value={value}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger
        id={id}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-[200px] appearance-none font-normal justify-between"
        )}
      >
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="pt">Português</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
      </SelectContent>
    </Select>
  );
}

const colors = [
  {
    value: "1",
    name: "Zinc",
    light: "bg-zinc-900",
    dark: "bg-zinc-700",
  },
  {
    value: "2",
    name: "Rose",
    light: "bg-rose-600",
    dark: "bg-rose-700",
  },
  {
    value: "3",
    name: "Blue",
    light: "bg-blue-600",
    dark: "bg-blue-700",
  },
  {
    value: "4",
    name: "Green",
    light: "bg-green-600",
    dark: "bg-green-500",
  },
  {
    value: "5",
    name: "Orange",
    light: "bg-orange-500",
    dark: "bg-orange-700",
  },
];
export function ThemeColorChanger({
  onChange,
  onBlur,
  id,
  isPending,
}: RenderInputArgs) {
  const { themeColor, setThemeColor } = useThemeContext();
  const { theme } = useNextTheme();

  const handleChange = (colorIndex: string) => {
    setThemeColor(Number(colorIndex));
    onChange(colorIndex);

    // Remove this if you are sure that it works this way
    // setTimeout(() => {
    onBlur(undefined, colorIndex);
    // }, 200);
  };

  return (
    <Select
      defaultValue={themeColor.toString()}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger
        id={id}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-[200px] appearance-none font-normal justify-between"
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{createSelectItems(colors, theme)}</SelectContent>
    </Select>
  );
}

export function ThemeToggle({
  onChange,
  onBlur,
  id,
  initialValue,
  className,
  isPending,
}: RenderInputArgs) {
  const { theme, setTheme } = useNextTheme();
  const { t } = useTranslation();
  const activeString = `(${t("common:active").toLowerCase()})`;

  const handleChange = (value: string) => {
    setTheme(value);
    onChange(value);
    setTimeout(() => {
      onBlur(undefined, value);
    }, 200);
  };
  return (
    <div className={cn(className, "grid max-w-md grid-cols-2 gap-8 pt-2")}>
      <div
        onClick={isPending ? () => {} : () => handleChange("light")}
        className={cn(isPending && "opacity-50 cursor-not-allowed")}
      >
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
          {t("appearance-theme_light")}{" "}
          {!isPending && theme === "light" && activeString}
        </label>
      </div>

      <div
        onClick={isPending ? () => {} : () => handleChange("dark")}
        className={cn(isPending && "opacity-50 cursor-not-allowed")}
      >
        <div
          className={cn(
            "items-center rounded-md border-2 border-muted bg-popover p-1",
            !isPending && "hover:bg-accent hover:text-accent-foreground"
          )}
        >
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
          {t("appearance-theme_dark")}{" "}
          {!isPending && theme === "dark" && activeString}
        </label>
      </div>
    </div>
  );
}

export const createSelectItems = (data: any[], theme: string | undefined) => {
  return data.map(({ name, light, dark, value }) => (
    <SelectItem key={value} value={value || name}>
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
