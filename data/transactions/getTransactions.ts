import "server-only";
import { getPayloadClient } from "@/lib/payload";
import { Where } from "payload";
import { getCurrentPayloadCustomer } from "../customers/getCustomer";

export const getTransactions = async (planId?: string, limit?: number) => {
  const { id: customerId } = await getCurrentPayloadCustomer();
  const payload = await getPayloadClient();

  let query: Where;
  if (planId) {
    console.log(planId);
    query = {
      plan: {
        equals: planId,
      },
    };
  } else {
    query = {
      customer: {
        equals: customerId,
      },
    };
  }

  const response = await payload.find({
    collection: "transactions",
    where: query,
    limit,
    sort: "-createdAt",
  });

  return response.docs;
};
