import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <Link href="/" className="flex items-center gap-2 user-select-none">
        {/* <img
            src="/path/to/your/logo-image.png"
            alt="Logo"
            className="w-12 h-auto mr-2"
          /> */}
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
            style={{ fontFamily: "var(--font-disket-mono-regular)" }}
            className="text-black font-bold user-select-none tracking-tight text-xl" // or text-2xl
          >
            ETPZP-SMS
          </span>
        )}
      </Link>
    </>
  );
}
