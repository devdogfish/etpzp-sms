"use client";
import { Frown } from "lucide-react";

type ErrorComponentProps = {
  children?: React.ReactNode;
  title: string;
  subtitle: string;
};
export default function ErrorComponent({
  children,
  title,
  subtitle,
}: ErrorComponentProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <Frown className="text-muted-foreground h-10 w-10 stroke-[1.2px]" />
        <div className="flex flex-col items-center">
          <h2>{title}</h2>
          <p className="text-sm">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
