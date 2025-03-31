import { APP_NAME } from "@/global.config";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <Link href="/" className="flex items-center gap-2 user-select-none">
        <Image
          src="/etpzp_sms-logo.png"
          alt="Application logo"
          width={48}
          height={48}
          className="user-select-none"
        />
        {!isCollapsed && (
          <span
            // className=""
            style={{ fontFamily: "", background: "var(--color-yellow)" }}
            className="font-bold user-select-none tracking-tight text-xl font-disket-mono-regular" // or text-2xl
          >
            {APP_NAME}
          </span>
        )}
      </Link>
    </>
  );
}
