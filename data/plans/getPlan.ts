import "server-only";
import { getPayloadClient } from "@/lib/payload";
import { getCurrentPayloadCustomer } from "../customers/getCustomer";
import { cache } from "react";
import { notFound } from "next/navigation";

export const getPlan = cache(async (planId: string) => {
  await getCurrentPayloadCustomer(); // required for authentication
  const payload = await getPayloadClient();
  const plan = await payload.findByID({
    collection: "savings-plans",
    id: planId,
  });

  if (!plan) {
    notFound();
  }
  return plan;
});
