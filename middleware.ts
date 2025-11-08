import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher("/dashboard(.*)");
const isAuthRoute = createRouteMatcher("/auth(.*)");

export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req)) {
    if (!(await auth()).isAuthenticated) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/auth/login";
      redirectUrl.searchParams.set(
        "returnTo",
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(new URL(redirectUrl, req.nextUrl.origin));
    }
  }

  if (isAuthRoute(req)) {
    if ((await auth()).isAuthenticated) {
      return NextResponse.redirect(
        new URL("/dashboard/overview", req.nextUrl.origin)
      );
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};