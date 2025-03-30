"use client";
import React from "react";
import { cn, getNameInitials } from "@/lib/utils";
import { CircleUser, CircleUserRound, UserRound } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { ThemeProperties } from "@/types/theme";

type ProfilePicProps = {
  size?: number;
  colorProperties?: ThemeProperties;
  name?: string;
  loading?: boolean;
  customSize?: boolean;
  fill?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ProfilePic({
  size = 9,
  name,
  colorProperties,
  loading,
  fill = true,
  customSize = false,
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

  const sizeStyling =
    customSize === true
      ? {}
      : { width: `${size * 4}px`, height: `${size * 4}px` };
  return (
    <div
      className={cn(
        `flex justify-center items-center rounded-full`, // border border-muted-foreground - Don't like this

        className // add additional passed in classNames
      )}
      // For some reason we need to use inline styles for this, as it seems to get overridden
      style={{
        ...sizeStyling,
        backgroundColor: `hsl(${colorProperties?.primary})`,
        color: `hsl(${colorProperties?.primaryForeground})`,
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
