"use client";

import { PageHeader, SectionHeader } from "@/components/headers";
import {
  LanguageChanger,
  ThemeToggle,
  ThemeColorChanger,
  createSelectItems,
  ColorDropdown,
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
import SettingsItem from "../../../../../components/settings-item";
import { cn } from "@/lib/utils";
import { useTheme as useNextTheme } from "next-themes";
import { useThemeContext } from "@/contexts/theme-data-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Settings() {
  const { t } = useTranslation();
  const { theme } = useNextTheme();
  const { themeColor, setThemeColor } = useThemeContext();
  const onMobile = useIsMobile();

  const initialValues = {
    profile: {
      displayName:
        localStorage.getItem("display_name") || "Initial display name",
      colorId: localStorage.getItem("profile_color_id") || undefined,
    },
    appearance: {
      darkMode: theme,
      layout: localStorage.getItem("appearance_layout") || "MODERN",
      primaryColor: themeColor.toString(),
    },
  };

  return (
    <>
      <PageHeader title={t("header")} />

      <ScrollArea
        className={
          onMobile
            ? "h-[calc(100vh-var(--simple-header-height))]"
            : "h-[calc(100vh-var(--header-height))]"
        }
      >
        <div
          className="p-4" /* Inside looks better with rimless bottom on scroll on scroll */
        >
          <div className="space-y-12">
            <SectionHeader
              title={t("language-header")}
              subtitle={t("language-header_caption")}
              anchorName="language"
            >
              <SettingsItem
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
                      // This component has custom behavior. Only select props are used as it handles its own submission,
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
              <SettingsItem
                name="profile_color_id" // this might need to be the exact database field
                label={t("profile-color_label")}
                caption={t("profile-color_label_caption")}
                renderInput={({ value, onChange, onBlur, id, isPending }) => (
                  <ColorDropdown
                    initialValue={initialValues.profile.colorId}
                    id={id}
                    value={value}
                    isPending={isPending}
                    // We need to do nothing here because the this type of setting is handled internally (in settings-item)
                    onValueChange={(colorIndex: string) => {}}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <SettingsItem
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
              <SettingsItem
                name="primary_color_id" // this might need to be the exact database field
                label={t("appearance-color_label")}
                caption={t("appearance-color_label_caption")}
                renderInput={({ value, onChange, onBlur, id, isPending }) => (
                  <ColorDropdown
                    initialValue={initialValues.appearance.primaryColor}
                    // Initial value handled internally
                    id={id}
                    value={value}
                    isPending={isPending}
                    onValueChange={(colorIndex: string) =>
                      setThemeColor(Number(colorIndex))
                    }
                    // we call these in onValueChange
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />

              <SettingsItem
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
              <SettingsItem
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
        </div>
      </ScrollArea>
    </>
  );
}
