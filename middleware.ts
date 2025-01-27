import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/sessions";

export async function middleware(request: NextRequest) {
  // Handle i18n routing
  const i18nResponse = await i18nRouter(request, i18nConfig);
  const session = await getSession(request, i18nResponse);

  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/static")) {
    return i18nResponse;
  }

  // Redirect to "/" if authenticated
  if (session.isAuthenticated && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to login if not authenticated
  if (!session.isAuthenticated && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Don't allow non-admins to see admin-dashboard. Return unauthorized error if authenticated but not admin. This takes you to the typical api page...
  if (pathname.startsWith("/dashboard") && session?.user?.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }

  // Return the i18n response for all other cases
  return i18nResponse;
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
