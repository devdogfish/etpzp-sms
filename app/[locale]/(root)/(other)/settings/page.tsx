"use client";

import { PageHeader, SectionHeader } from "@/components/header";
import {
  LanguageChanger,
  ThemeModeToggle,
  ThemeColorChanger,
  createSelectItems,
} from "@/components/settings";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import SettingItem from "../../../../../components/settings-item";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function Settings() {
  const { t } = useTranslation(["Navigation"]);

  // maybe include some simple hooks here so we don't these external components
  const { theme } = useTheme();
  return (
    <>
      <PageHeader title={t("SETTING")} />
      <div className="py-4 px-4 space-y-12 h-[calc(100vh-52px)] overflow-y-scroll">
        <SectionHeader
          title="Language"
          subtitle="Select your preferred language for a personalized experience"
        >
          <SettingItem
            name="lang"
            label="Language"
            description="Set the font you want to use in the app."
            renderInput={({ value, onChange, onBlur, id }) => (
              <LanguageChanger
                id={id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </SectionHeader>

        <SectionHeader
          title="Profile"
          subtitle="Manage your personal information"
        >
          <SettingItem
            name="profile_color_id" // this might need to be the exact database field
            label="Profile color"
            description="Set the profile color you want to see in the app."
            renderInput={({ value, onChange, onBlur, id, initialValue }) => (
              <Select onValueChange={onChange} defaultValue={""}>
                <SelectTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-[200px] appearance-none font-normal justify-between"
                  )}
                  // defaultValue={"1"}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {createSelectItems(
                    [
                      { name: "1", light: "bg-chart-1", dark: "bg-chart-1" },
                      { name: "2", light: "bg-chart-2", dark: "bg-chart-2" },
                      { name: "3", light: "bg-chart-3", dark: "bg-chart-2" },
                      { name: "4", light: "bg-chart-4", dark: "bg-chart-2" },
                      { name: "5", light: "bg-chart-5", dark: "bg-chart-2" },
                    ],
                    theme
                  )}
                </SelectContent>
              </Select>
            )}
          />
          <SettingItem
            name="display_name" // this might need to be the exact database field
            label="Display Name"
            description="Enter a display name for your profile."
          />
        </SectionHeader>

        <SectionHeader
          title="Appearance"
          subtitle="Customize the look and feel of your app"
        >
          <SettingItem
            name="theme_color_id" // this might need to be the exact database field
            label="Theme color"
            description="Set the font you want to use in the app."
            renderInput={({ value, onChange, onBlur, id, initialValue }) => (
              <ThemeColorChanger
                id={id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <SettingItem
            name="dark_mode"
            label="Theme"
            description="Select the theme for the app."
            renderInput={({ value, onChange, onBlur, id, initialValue }) => (
              <ThemeModeToggle
              // id={id}
              // value={value}
              // onChange={onChange}
              // onBlur={onBlur}
              />
            )}
          />
        </SectionHeader>
      </div>
    </>
  );
}
