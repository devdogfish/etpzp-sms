import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18n.config";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/sessions";

export default async function middleware(request: NextRequest) {
  // Handle i18n routing
  const i18nResponse = i18nRouter(request, i18nConfig);
  const session = await getSession(request, i18nResponse);
  const { pathname } = request.nextUrl;
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";

  // Pathname checks use `.includes()` instead of `.startsWith()`, because there could be a locale in between url segments.
  // Redirect logged in users to home
  if (session.isAuthenticated && pathname.includes("/login")) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

  // Redirect unauthorized users to login
  if (!session.isAuthenticated && !pathname.includes("/login")) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Return the i18n-router response for all other cases
  return i18nResponse;
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
