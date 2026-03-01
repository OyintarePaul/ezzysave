import { auth, clerkClient } from "@clerk/nextjs/server";

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

interface CustomJwtClaims {
  last_verify?: string | number;
  last_login?: string | number;
}

export async function isRecentlyVerified() {
  const { userId, sessionClaims } = (await auth()) as {
    userId: string | null;
    sessionClaims: CustomJwtClaims;
  };

  if (!userId) throw new Error("You are not logged in.");

  const lastVerify = new Date(sessionClaims?.last_verify || 0).getTime();
  const lastLogin = new Date(sessionClaims?.last_login || 0).getTime();
  const now = Date.now();

  console.log("lastVerify", new Date(lastVerify).toISOString());
  console.log("lastLogin", new Date(lastLogin).toISOString());
  console.log("now", new Date(now).toISOString());

  // 1. Ensure they actually did a fresh OTP (not just a login)
  if (!lastVerify || lastVerify <= lastLogin) {
    return false;
  }

  // 2. Ensure the OTP was done in the last 3 minutes
  if (now - lastVerify > 3 * 60 * 1000) {
    return false;
  }

  return true;
}
