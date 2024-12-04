"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/contexts/theme-data-provider";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

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
    <Select
      onValueChange={(newColor) => setThemeColor(newColor as ThemeColors)}
      defaultValue={themeColor}
    >
      <SelectTrigger className="flex gap-2 ring-offset-transparent focus:ring-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{createSelectItems()}</SelectContent>
    </Select>
  );
}
