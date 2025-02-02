"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  children?: React.ReactNode;
  text: string;
  className?: string;
  variant?: "outline" | "none" | "ghost";
  size?: "sm" | "lg";
}

export function CopyButton({
  children,
  text,
  className = "",
  variant,
  size,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    if (!copied) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className, "flex items-center")}
      onClick={handleCopy}
    >
      {copied ? (
        <Check style={{ width: ".8rem", height: ".8rem" }} />
      ) : (
        <Copy style={{ width: ".8rem", height: ".8rem" }} />
      )}{" "}
      <span>{children}</span>
    </Button>
  );
}
