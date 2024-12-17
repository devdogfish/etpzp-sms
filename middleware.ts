import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/sessions";

export async function middleware(request: NextRequest) {
  // Handle i18n routing
  const i18nResponse = await i18nRouter(request, i18nConfig);

  // Get the current session
  const session = await getSession(request, i18nResponse);

  // Always redirect to login if not authenticated
  if (
    !session.isAuthenticated &&
    !request.nextUrl.pathname.startsWith("/login")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Don't allow non-admins to see admin-dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard") && !session.isAdmin) {
    // Return unauthorized error if authenticated but not admin. This takes you to the typical api page...
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
