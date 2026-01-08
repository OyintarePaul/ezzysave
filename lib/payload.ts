import { getPayload, Where } from "payload";
import config from "@/payload.config";

export async function getPayloadClient() {
  return getPayload({ config });
}

export async function createPayloadCustomer(
  clerkId: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }
) {
  // Placeholder function for creating a Payload customer
  const payload = await getPayloadClient();
  const newUser = await payload.create({
    collection: "customers",
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      clerkId: clerkId,
    },
  });

  return newUser;
}

export async function deletePayloadCustomer(clerkId: string) {
  // Placeholder function for deleting a Payload customer
  const payload = await getPayload({ config });
  await payload.delete({
    collection: "customers",
    where: {
      clerkId: { equals: clerkId },
    },
  });
}

export async function updatePayloadCustomer(
  clerkId: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }
) {
  // Placeholder function for updating a Payload customer
  const payload = await getPayload({ config });
  const customers = await payload.find({
    collection: "customers",
    where: {
      clerkId: { equals: clerkId },
    },
  });

  if (customers.totalDocs === 0) {
    throw new Error("Customer not found");
  }

  const customer = customers.docs[0];

  const updatedUser = await payload.update({
    collection: "customers",
    id: customer.id,
    data: {
      firstName: data.firstName ?? customer.firstName,
      lastName: data.lastName ?? customer.lastName,
      email: data.email ?? customer.email,
      phone: data.phone ?? customer.phone,
    },
  });

  return updatedUser;
}

export async function getPayloadCustomerByClerkId(clerkId: string) {
  const payload = await getPayloadClient();
  const customers = await payload.find({
    collection: "customers",
    where: {
      clerkId: { equals: clerkId },
    },
  });

  if (customers.totalDocs === 0) {
    return null;
  }
  return customers.docs[0];
}

export async function getStats(customerId: string) {
  const payload = await getPayloadClient();
  let totalSaved, totalTarget, activePlans, accruedInterest;

  const plans = await payload.find({
    collection: "savings-plans",
    where: {
      customer: { equals: customerId },
    },
  });

  totalSaved = plans.docs.reduce(
    (acc, plan) => acc + (plan.currentBalance || 0),
    0
  );

  totalTarget = plans.docs.reduce(
    (acc, plan) => acc + (plan.targetAmount || 0),
    0
  );

  activePlans = plans.docs.filter((p) => p.status === "Active").length;

  accruedInterest = plans.docs.reduce(
    (acc, plan) => acc + (plan.interestEarned || 0),
    0
  );

  return {
    totalSaved,
    totalTarget,
    activePlans,
    accruedInterest,
  };
}

export const getLoansForCustomer = async (customerId: string) => {
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

  if (response.totalDocs > 0) {
    return response.docs;
  } else {
    return [];
  }
};

export const getTransactions = async (
  customerId: string,
  planId?: string,
  limit?: number
) => {
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

  if (response.totalDocs > 0) {
    return response.docs;
  } else {
    return [];
  }
};
