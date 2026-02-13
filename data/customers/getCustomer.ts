import "server-only";
import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { z } from "zod";
import { getCurrentClerkUserId } from "@/lib/auth";

export const getCurrentPayloadCustomer = cache(async function () {
  const clerkUserId = await getCurrentClerkUserId();
  const payload = await getPayloadClient();
  const customers = await payload.find({
    collection: "customers",
    where: {
      clerkId: { equals: clerkUserId },
    },
    select: {
      withdrawalPin: false
    },
  });

  if (customers.totalDocs === 0) {
    // A customer is expected to be created in Payload when a user signs up via Clerk, so if we can't find a customer with the given clerkId, it's likely an error
    throw new Error(
      `Customer with clerkId: ${clerkUserId} not found in payload.`,
    );
  }
  return customers.docs[0];
});
