import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function pageAuthGuard(path: string) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return redirect("/login?returnTo=" + encodeURIComponent(path));
  }
}
