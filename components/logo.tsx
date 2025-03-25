import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function Logo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <Image
        src="/etpzp_sms-logo.png"
        alt="Application logo"
        width={48}
        height={48}
      />
      {!isCollapsed && <h2>ETPZP SMS</h2>}
    </>
  );
}
