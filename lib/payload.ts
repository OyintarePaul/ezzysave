import "server-only";
import { getPayload } from "payload";
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
  },
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
  const payload = await getPayloadClient();
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
  },
) {
  // Placeholder function for updating a Payload customer
  const payload = await getPayloadClient();
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






