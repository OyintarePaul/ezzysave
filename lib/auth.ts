import { auth, clerkClient } from "@clerk/nextjs/server";

export const getCurrentClerkUserId = async function () {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You are not logged in.");
  }
  console.log("lib/auth.ts: Current Clerk User ID:", userId);
  return userId;
};

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
