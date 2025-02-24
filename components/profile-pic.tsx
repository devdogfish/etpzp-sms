"use client";
import React from "react";
import { cn, getNameInitials } from "@/lib/utils";
import { CircleUser, CircleUserRound, UserRound } from "lucide-react";

type ProfilePicProps = {
  size?: number;
  colorId?: number;
  name?: string;
  loading?: boolean;
  customSize?: boolean;
  fill?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ProfilePic({
  size = 9,
  name,
  colorId,
  loading,
  fill = true,
  customSize = false,
  className,
  ...props
}: ProfilePicProps) {
  if (loading) return <h2 className="text-sm">Loading...</h2>;
  const sizeStyling =
    customSize === true
      ? {}
      : { width: `${size * 4}px`, height: `${size * 4}px` };
  return (
    <div
      className={cn(
        `flex justify-center items-center rounded-full border border-muted-foreground`,
        colorId
          ? `bg-chart-${colorId}`
          : fill
          ? `bg-muted`
          : "border border-muted-foreground",
        className // add additional passed in classNames
      )}
      // For some reason we need to use inline styles for this, as it seems to get overridden
      style={sizeStyling}
      {...props}
    >
      {name ? (
        <p
          className={cn(
            "text-sm text-accent-foreground",
            // For dark purple, we want the text to be white for readability
            colorId == 5 && "text-background dark:text-foreground",
            colorId && colorId > 1 && colorId < 5 && "dark:text-background"
          )}
        >
          {getNameInitials(name)}
        </p>
      ) : (
        <UserRound
          className="height-full text-accent-foreground"
          strokeWidth={1.14}
        />
      )}
    </div>
  );
}
