// lib/auth0.js

import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { redirect } from "next/navigation";

// Initialize the Auth0 client 
export const auth0 = new Auth0Client({
  // Options are loaded from environment variables by default
  // Ensure necessary environment variables are properly set
  // domain: process.env.AUTH0_DOMAIN,
  // clientId: process.env.AUTH0_CLIENT_ID,
  // clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // appBaseUrl: process.env.APP_BASE_URL,
  // secret: process.env.AUTH0_SECRET,

  authorizationParameters: {
    // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for API authorized applications are no longer automatically picked up by the SDK.
    // Instead, we need to provide the values explicitly.
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
    redirect_uri: "https://laughing-space-telegram-j9xw4q7jw6jcj5v9-3000.app.github.dev/home",
  }
});

export async function pageAuthGuard(path: string) {
  const session = await auth0.getSession();

  if (!session) {
    return redirect("/api/auth/login?returnTo=" + encodeURIComponent(path));
  }
}