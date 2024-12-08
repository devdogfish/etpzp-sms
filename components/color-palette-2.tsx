import React from "react";
import { cn } from "@/lib/utils";

const colorClasses = [
  { name: "Background", class: "bg-background", cssVar: "--background" },
  { name: "Foreground", class: "bg-foreground", cssVar: "--foreground" },
  { name: "Card", class: "bg-card", cssVar: "--card" },
  {
    name: "Card Foreground",
    class: "bg-card-foreground",
    cssVar: "--card-foreground",
  },
  { name: "Popover", class: "bg-popover", cssVar: "--popover" },
  {
    name: "Popover Foreground",
    class: "bg-popover-foreground",
    cssVar: "--popover-foreground",
  },
  { name: "Primary", class: "bg-primary", cssVar: "--primary" },
  {
    name: "Primary Foreground",
    class: "bg-primary-foreground",
    cssVar: "--primary-foreground",
  },
  { name: "Secondary", class: "bg-secondary", cssVar: "--secondary" },
  {
    name: "Secondary Foreground",
    class: "bg-secondary-foreground",
    cssVar: "--secondary-foreground",
  },
  { name: "Muted", class: "bg-muted", cssVar: "--muted" },
  {
    name: "Muted Foreground",
    class: "bg-muted-foreground",
    cssVar: "--muted-foreground",
  },
  { name: "Accent", class: "bg-accent", cssVar: "--accent" },
  {
    name: "Accent Foreground",
    class: "bg-accent-foreground",
    cssVar: "--accent-foreground",
  },
  { name: "Destructive", class: "bg-destructive", cssVar: "--destructive" },
  {
    name: "Destructive Foreground",
    class: "bg-destructive-foreground",
    cssVar: "--destructive-foreground",
  },
  { name: "Border", class: "bg-border", cssVar: "--border" },
  { name: "Input", class: "bg-input", cssVar: "--input" },
  { name: "Ring", class: "bg-ring", cssVar: "--ring" },
];

const chartColors = [
  { name: "Chart 1", class: "bg-chart-1", cssVar: "--chart-1" },
  { name: "Chart 2", class: "bg-chart-2", cssVar: "--chart-2" },
  { name: "Chart 3", class: "bg-chart-3", cssVar: "--chart-3" },
  { name: "Chart 4", class: "bg-chart-4", cssVar: "--chart-4" },
  { name: "Chart 5", class: "bg-chart-5", cssVar: "--chart-5" },
];

const ColorRow = ({
  name,
  class: bgClass,
  cssVar,
}: {
  name: string;
  class: string;
  cssVar: string;
}) => (
  <tr className="border-b border-border">
    <td className="py-2 px-4">
      <div className="flex items-center space-x-2">
        <div
          className={cn("w-6 h-6 rounded shadow", bgClass)}
          aria-hidden="true"
        ></div>
        <span>{name}</span>
      </div>
    </td>
    <td className="py-2 px-4">{bgClass}</td>
    <td className="py-2 px-4">{cssVar}</td>
  </tr>
);

export function ColorPalette2() {
  return (
    <div className="p-6 bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-left py-2 px-4">Color</th>
              <th className="text-left py-2 px-4">Tailwind Class</th>
              <th className="text-left py-2 px-4">CSS Variable</th>
            </tr>
          </thead>
          <tbody>
            {colorClasses.map((color) => (
              <ColorRow key={color.name} {...color} />
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="text-xl font-bold mt-8 mb-4">Chart Colors</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-left py-2 px-4">Color</th>
              <th className="text-left py-2 px-4">Tailwind Class</th>
              <th className="text-left py-2 px-4">CSS Variable</th>
            </tr>
          </thead>
          <tbody>
            {chartColors.map((color) => (
              <ColorRow key={color.name} {...color} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
