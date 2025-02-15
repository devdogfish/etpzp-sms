"use client";

import { cn, getNameInitials } from "@/lib/utils";

export default function ProfilePic({
  size,
  name,
  colorId,
  loading,
  fill = true,
}: {
  size: number;
  colorId?: number;
  name?: string;
  loading?: boolean;
  fill?: boolean;
}) {
  if (loading) return <h2 className="text-sm">Loading...</h2>;
  return (
    <div
      className={cn(
        `w-${size} h-${size} rounded-full content-center text-center`,
        colorId
          ? `bg-chart-${colorId}`
          : fill
          ? `bg-muted`
          : "border border-muted-foreground"
      )}
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
