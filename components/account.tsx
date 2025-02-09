"use client";

import { cn, getNameInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Account({
  size,
  name,
  colorId,
  loading,
}: {
  size: number;
  colorId: number | undefined;
  name: string | undefined;
  loading?: boolean;
}) {
  if (loading) return <h2 className="text-sm">Loading...</h2>;
  return (
    <div
      className={`w-${size} h-${size} rounded-full content-center bg-chart-${colorId}`}
    >
      <p
        className={cn(
          "text-sm",
          // For dark purple, we want the text to be white for readability
          colorId == 5 && "text-background dark:text-foreground",
          colorId && colorId > 1 && colorId < 5 && "dark:text-background"
        )}
      >
        {getNameInitials(name)}
      </p>
    </div>
  );
}
