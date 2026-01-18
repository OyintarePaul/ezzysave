import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function pageAuthGuard(path: string) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return redirect("/login?returnTo=" + encodeURIComponent(path));
  }
}

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user;
}

export async function verifyPassword(userId: string, password: string) {
  try {
    const client = await clerkClient();
    const { verified } = await client.users.verifyPassword({
      password,
      userId,
    });

    return verified;
  } catch (error) {
    return false;
  }
}
