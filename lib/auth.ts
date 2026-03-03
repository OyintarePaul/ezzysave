import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export const getCurrentClerkUserId = async function () {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You are not logged in.");
  }
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
    console.log(error);
    return false;
  }
}

/**
 * Checks if the user's primary email was verified within the last X milliseconds.
 * Default: 5 minutes (300,000 ms)
 */

export async function isRecentlyVerified(
  thresholdMs: number = 300000, // 5 minutes
): Promise<boolean> {
  const user = await currentUser();

  // 1. Basic checks: Is the user logged in and do they have a primary email?
  if (!user || !user.primaryEmailAddressId) return false;

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  );

  // 2. Ensure the email is actually in a 'verified' state
  if (!primaryEmail || primaryEmail.verification?.status !== "verified") {
    return false;
  }

  /**
   * FIX: In the Server SDK, we check the User's updatedAt
   * OR the specific verification's strategy-based timestamp.
   * Since Clerk updates the User record upon successful OTP,
   * user.updatedAt is our most reliable source.
   */
  const lastUpdatedTime = user.updatedAt; // This is a number (ms) in Server SDK
  const now = Date.now();
  console.log("Last updated time:", new Date(lastUpdatedTime).toISOString());
  console.log("Current time:", new Date(now).toISOString());
  console.log("Difference (ms):", now - lastUpdatedTime);

  return now - lastUpdatedTime <= thresholdMs;
}
