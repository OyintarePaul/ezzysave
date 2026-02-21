import "server-only";
import { getPayloadClient } from "@/lib/payload";
import { Where } from "payload";
import { getCurrentPayloadCustomer } from "../customers/getCustomer";

export const getTransactions = async (
  customerId: string,
  planId?: string,
  limit?: number,
) => {
  const payload = await getPayloadClient();

  let query: Where;
  if (planId) {
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
    where: {
      ...query,
      status: {
        equals: "completed",
      },
    },
    limit,
    sort: "-createdAt",
  });

  return response.docs;
};
