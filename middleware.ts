import { NextResponse, NextRequest } from "next/server";
import { auth0 } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  const session = await auth0.getSession(request);

  // Redirect logged-in users accessing the root path to the dashboard if there is a session
  if (request.nextUrl.pathname === "/" && session) {
    return NextResponse.redirect(
      new URL("/auth/login?returnTo=/dashboard", request.nextUrl.origin)
    );
  }

  // Allow access to authentication routes without a session
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authResponse;
  }

  // Redirect unauthenticated users trying to access the dashboard to the login page
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin)
    );
  }

  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
