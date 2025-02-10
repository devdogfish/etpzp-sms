import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Regex to check whether something has an extension, e.g. .jpg
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { nextUrl, headers } = request;
  // Cloned url to work with
  const url = nextUrl.clone();
  // Client language, defaults to en
  const language =
    headers
      .get("accept-language")
      ?.split(",")?.[0]
      .split("-")?.[0]
      .toLowerCase() || "en";

  try {
    // Early return if it is a public file such as an image or an api call
    if (
      PUBLIC_FILE.test(nextUrl.pathname) ||
      nextUrl.pathname.includes("/api")
    ) {
      return undefined;
    }

    // Proceed without redirection if on a localized path
    if (
      nextUrl.pathname.startsWith("/en") ||
      nextUrl.pathname.startsWith("/de") ||
      nextUrl.pathname.startsWith("/fr")
    ) {
      return undefined;
    }

    return undefined;
  } catch (error) {
    console.log(error);
  }
}
