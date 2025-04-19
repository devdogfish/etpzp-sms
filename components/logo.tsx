import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AppLogo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <Link
        href="/"
        className="flex items-center gap-2 user-select-none focus-primary-ring"
      >
        <Image
          src="/etpzp_sms-logo.png"
          alt="Application logo"
          width={48}
          height={48}
          className="user-select-none relative bottom-[2px]"
        />
        {!isCollapsed && (
          <span
            className="font-bold user-select-none tracking-tight text-xl font-disket-mono-regular" // or text-2xl
          >
            ETPZP-SMS
          </span>
        )}
      </Link>
    </>
  );
}
