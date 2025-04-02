"use client";

import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CopyButtonProps {
  children?: React.ReactNode;
  text: string;
  className?: string;
  variant?: "outline" | "none" | "ghost" | "link";
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
  const { t } = useTranslation(["common"]);
  const successMessage = t("copy_btn-success");

  // We need this complex logic or it won't work in some browsers
  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!copied) {
      try {
        // Check if the Clipboard API is supported
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success(successMessage); // Notify success
        } else {
          // Fallback for browsers that do not support the Clipboard API
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
          textarea.style.opacity = "0"; // Make it invisible
          textarea.setAttribute("readonly", ""); // Make it read-only
          document.body.appendChild(textarea);
          textarea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textarea);

          if (successful) {
            setCopied(true);
            toast.success(successMessage); // Notify success
          } else {
            throw new Error("Copy command was unsuccessful.");
          }
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        // Handle any errors that occur during the copy process
        console.log("Failed to copy text: ", error);
        toast.error("copy_btn-error"); // Notify failure
      }
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
