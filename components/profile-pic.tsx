"use client";

import React from "react";
import { cn, getNameInitials } from "@/lib/utils";
import { UserRound } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { ThemeProperties } from "@/types/theme";

type ProfilePicProps = {
  size?: number;
  name?: string;
  colorObj?: ThemeProperties | undefined;
  loading?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ProfilePic({
  size = 9,
  name,
  // Will be filled use the colorObj's properties if it is provided
  colorObj,
  loading,
  className,
  ...props
}: ProfilePicProps) {
  if (loading)
    return (
      <Skeleton
        width={36}
        height={36}
        circle
        containerClassName={cn("flex", className)}
      />
    );

  return (
    <div
      className={cn(
        `flex justify-center items-center rounded-full`, // border border-muted-foreground - Don't like this
        className // add additional passed in classNames
      )}
      // For some reason we need to use inline styles for this, as it seems to get overridden
      style={{
        width: `${size * 4}px`,
        height: `${size * 4}px`,
        backgroundColor: `hsl(${colorObj?.primary})`,
        color: `hsl(${colorObj?.primaryForeground})`,
      }}
      {...props}
    >
      {name ? (
        <p className={cn("text-sm")}>{getNameInitials(name)}</p>
      ) : (
        <UserRound
          className="height-full text-accent-foreground"
          strokeWidth={1.14}
        />
      )}
    </div>
  );
}
