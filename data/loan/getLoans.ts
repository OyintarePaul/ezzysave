import "server-only";
import { getCurrentPayloadCustomer } from "../customers/getCustomer";
import { getPayloadClient } from "@/lib/payload";

export const getLoans = async () => {
  const { id: customerId } = await getCurrentPayloadCustomer();
  const payload = await getPayloadClient();
  const response = await payload.find({
    collection: "loans",
    where: {
      customer: {
        equals: customerId,
      },
    },
    sort: "-updatedAt",
  });

  return response.docs;
};
