import "server-only";
import { getPayloadClient } from "@/lib/payload";
import { getCurrentPayloadCustomer } from "../customers/getCustomer";
import { cache } from "react";

export const getSavingsPlans = cache(async () => {
  const { id: customerId } = await getCurrentPayloadCustomer();
  const payload = await getPayloadClient();

  const plans = await payload.find({
    collection: "savings-plans",
    where: {
      customer: { equals: customerId },
    },
  });

  return plans.docs;
});
