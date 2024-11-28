import React from "react";
import { cn } from "@/lib/utils";

const colorClasses = [
  {
    name: "Background",
    class: "bg-background",
    textClass: "text-foreground",
    cssVar: "--background",
  },
  {
    name: "Foreground",
    class: "bg-foreground",
    textClass: "text-background",
    cssVar: "--foreground",
  },
  {
    name: "Card",
    class: "bg-card",
    textClass: "text-card-foreground",
    cssVar: "--card",
  },
  {
    name: "Card Foreground",
    class: "bg-card-foreground",
    textClass: "text-card",
    cssVar: "--card-foreground",
  },
  {
    name: "Popover",
    class: "bg-popover",
    textClass: "text-popover-foreground",
    cssVar: "--popover",
  },
  {
    name: "Popover Foreground",
    class: "bg-popover-foreground",
    textClass: "text-popover",
    cssVar: "--popover-foreground",
  },
  {
    name: "Primary",
    class: "bg-primary",
    textClass: "text-primary-foreground",
    cssVar: "--primary",
  },
  {
    name: "Primary Foreground",
    class: "bg-primary-foreground",
    textClass: "text-primary",
    cssVar: "--primary-foreground",
  },
  {
    name: "Secondary",
    class: "bg-secondary",
    textClass: "text-secondary-foreground",
    cssVar: "--secondary",
  },
  {
    name: "Secondary Foreground",
    class: "bg-secondary-foreground",
    textClass: "text-secondary",
    cssVar: "--secondary-foreground",
  },
  {
    name: "Muted",
    class: "bg-muted",
    textClass: "text-muted-foreground",
    cssVar: "--muted",
  },
  {
    name: "Muted Foreground",
    class: "bg-muted-foreground",
    textClass: "text-muted",
    cssVar: "--muted-foreground",
  },
  {
    name: "Accent",
    class: "bg-accent",
    textClass: "text-accent-foreground",
    cssVar: "--accent",
  },
  {
    name: "Accent Foreground",
    class: "bg-accent-foreground",
    textClass: "text-accent",
    cssVar: "--accent-foreground",
  },
  {
    name: "Destructive",
    class: "bg-destructive",
    textClass: "text-destructive-foreground",
    cssVar: "--destructive",
  },
  {
    name: "Destructive Foreground",
    class: "bg-destructive-foreground",
    textClass: "text-destructive",
    cssVar: "--destructive-foreground",
  },
  {
    name: "Border",
    class: "bg-border",
    textClass: "text-foreground",
    cssVar: "--border",
  },
  {
    name: "Input",
    class: "bg-input",
    textClass: "text-foreground",
    cssVar: "--input",
  },
  {
    name: "Ring",
    class: "bg-ring",
    textClass: "text-background",
    cssVar: "--ring",
  },
];

const chartColors = [
  {
    name: "Chart 1",
    class: "bg-chart-1",
    textClass: "text-background",
    cssVar: "--chart-1",
  },
  {
    name: "Chart 2",
    class: "bg-chart-2",
    textClass: "text-background",
    cssVar: "--chart-2",
  },
  {
    name: "Chart 3",
    class: "bg-chart-3",
    textClass: "text-background",
    cssVar: "--chart-3",
  },
  {
    name: "Chart 4",
    class: "bg-chart-4",
    textClass: "text-background",
    cssVar: "--chart-4",
  },
  {
    name: "Chart 5",
    class: "bg-chart-5",
    textClass: "text-background",
    cssVar: "--chart-5",
  },
];

const ColorCard = ({
  name,
  class: bgClass,
  textClass,
  cssVar,
}: {
  name: string;
  class: string;
  textClass: string;
  cssVar: string;
}) => (
  <div className="flex flex-col space-y-2 p-2 rounded-lg shadow-md bg-card">
    <div className={cn("w-full h-20 rounded-md", bgClass)} aria-hidden="true">
      <div
        className={cn(
          "w-full h-full flex items-center justify-center",
          textClass
        )}
      >
        <span className="font-semibold">{name}</span>
      </div>
    </div>
    <div className="text-sm">
      <p>
        <span className="font-medium">Tailwind BG:</span> {bgClass}
      </p>
      <p>
        <span className="font-medium">Tailwind Text:</span> {textClass}
      </p>
      <p>
        <span className="font-medium">CSS Variable:</span> {cssVar}
      </p>
    </div>
  </div>
);

export  function ColorPalette2() {
  return (
    <div className="p-3 bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-6">Color Palette</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {colorClasses.map((color) => (
          <ColorCard key={color.name} {...color} />
        ))}
      </div>
      <h3 className="text-xl font-bold mt-8 mb-6">Chart Colors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {chartColors.map((color) => (
          <ColorCard key={color.name} {...color} />
        ))}
      </div>
    </div>
  );
}
