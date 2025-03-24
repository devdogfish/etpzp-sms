"use client";

import { PageHeader, SectionHeader } from "@/components/header";
import {
  LanguageChanger,
  ThemeToggle,
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
import { cn, getComplexObjectFromCookie } from "@/lib/utils";
import { useTheme as useNextTheme } from "next-themes";

export default function Settings() {
  const { t } = useTranslation();
  const { theme } = useNextTheme();

  const initialValues = {
    profile: {
      displayName:
        localStorage.getItem("display_name") || "Initial display name",
      colorId: localStorage.getItem("profile_color_id") || undefined,
    },
    appearance: {
      darkMode: theme,
      layout: localStorage.getItem("appearance_layout") || "MODERN",
    },
  };
  return (
    <>
      <PageHeader title={t("header")} />
      <div className="py-4 px-4 space-y-12 h-[calc(100vh-var(--header-height))] overflow-y-scroll">
        <SectionHeader
          title={t("language-header")}
          subtitle={t("language-header_caption")}
          anchorName="language"
        >
          <SettingItem
            name="lang"
            label={t("language-language_label")}
            caption={t("language-language_label_caption")}
            renderInput={({
              value,
              onChange,
              onBlur,
              id,
              isPending,
              setServerState,
            }) => {
              return (
                <LanguageChanger
                  // This component has custom behavior—only select props are used as it handles its own submission,
                  // and setServerState is passed so elements update with errors.
                  id={id}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  isPending={isPending}
                  setServerState={setServerState}
                />
              );
            }}
          />
        </SectionHeader>

        <SectionHeader
          title={t("profile-header")}
          subtitle={t("profile-header_caption")}
          anchorName="profile"
        >
          <SettingItem
            name="profile_color_id" // this might need to be the exact database field
            label={t("profile-color_label")}
            caption={t("profile-color_label_caption")}
            renderInput={({ value, onChange, onBlur, id, isPending }) => {
              const profileColors = [
                {
                  value: "1",
                  name: "Blue",
                  light: "bg-chart-1",
                  dark: "bg-chart-1",
                },
                {
                  value: "2",
                  name: "Green",
                  light: "bg-chart-2",
                  dark: "bg-chart-2",
                },
                {
                  value: "3",
                  name: "Yellow",
                  light: "bg-chart-3",
                  dark: "bg-chart-3",
                },
                {
                  value: "4",
                  name: "Orange",
                  light: "bg-chart-4",
                  dark: "bg-chart-4",
                },
                {
                  value: "5",
                  name: "Purple",
                  light: "bg-chart-5",
                  dark: "bg-chart-5",
                },
              ];
              return (
                <Select
                  defaultValue={initialValues.profile.colorId}
                  onValueChange={(value) => {
                    onChange(value);
                    setTimeout(() => {
                      onBlur(undefined, value);
                    }, 200);
                  }}
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
                  <SelectContent>
                    {createSelectItems(profileColors, theme)}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <SettingItem
            name="display_name"
            label={t("profile-name_label")}
            caption={t("profile-name_label_caption")}
            initialValue={initialValues.profile.displayName}
          />
        </SectionHeader>

        <SectionHeader
          title={t("appearance-header")}
          subtitle={t("appearance-header_caption")}
          anchorName="appearance"
        >
          <SettingItem
            name="primary_color_id" // this might need to be the exact database field
            label={t("appearance-primary_color_label")}
            caption={t("appearance-primary_color_label_caption")}
            renderInput={({ value, onChange, onBlur, id, isPending }) => (
              <ThemeColorChanger
                // Initial value handled internally
                id={id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                isPending={isPending}
              />
            )}
          />
          <SettingItem
            name="appearance_layout" // this might need to be the exact database field
            label={t("appearance-layout_label")}
            caption={t("appearance-layout_label_caption")}
            renderInput={({ value, onChange, onBlur, id, isPending }) => {
              const layouts = [
                {
                  value: "MODERN",
                  name: "Modern",
                },
                {
                  value: "SIMPLE",
                  name: "Simple",
                },
              ];
              return (
                <Select
                  defaultValue={initialValues.appearance.layout}
                  onValueChange={(value) => {
                    onChange(value);
                    setTimeout(() => {
                      onBlur(undefined, value);
                    }, 200);
                  }}
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
                  <SelectContent>
                    {createSelectItems(layouts, theme)}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <SettingItem
            name="dark_mode"
            label={t("appearance-theme_label")}
            caption={t("appearance-theme_label_caption")}
            renderInput={({ value, onChange, onBlur, id, isPending }) => (
              <ThemeToggle
                id={id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className="order-2"
                initialValue={initialValues.appearance.darkMode}
                isPending={isPending}
              />
            )}
          />
        </SectionHeader>
      </div>
    </>
  );
}
