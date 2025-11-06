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

// import { NextResponse, NextRequest } from "next/server";
// import { auth0 } from "@/lib/auth";

// export async function middleware(request: NextRequest) {
//   const authResponse = await auth0.middleware(request);

//   const session = await auth0.getSession(request);

//   // Redirect logged-in users accessing the root path to the dashboard if there is a session
//   if (request.nextUrl.pathname === "/" && session) {
//     return NextResponse.redirect(
//       new URL("/auth/login?returnTo=/overview", request.nextUrl.origin)
//     );
//   }

//   // Allow access to authentication routes without a session
//   if (request.nextUrl.pathname.startsWith("/auth")) {
//     return authResponse;
//   }

//   // Redirect unauthenticated users trying to access the dashboard to the login page
//   if (!session && request.nextUrl.pathname.startsWith("/overview")) {
//     return NextResponse.redirect(
//       new URL("/auth/login?returnTo=/overview", request.nextUrl.origin)
//     );
//   }

//   return authResponse;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      */
//     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };
