import React from "react";
import { ThemeColorChanger } from "./settings/ThemeColorChanger";
import ThemeModeToggle from "./settings/ThemeModeToggle";

export default function Header() {
  return (
    <div className="flex gap-1 mb-6">
      <h2 className="whitespace-nowrap mr-auto">Color Palette</h2>
      <ThemeColorChanger />
      <ThemeModeToggle />
    </div>
  );
}
