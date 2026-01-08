"use server";
import { SavingsPlan } from "@/payload-types";
import { getPayload } from "payload";
import config from "@payload-config";
import { currentUser } from "@clerk/nextjs/server";
import { getPayloadCustomerByClerkId } from "@/lib/payload";

type CreateSavingsPlanResponse =
  | {
      status: "success";
      message: string;
      data: SavingsPlan;
    }
  | {
      status: "error";
      message: string;
      data: null;
    };

export async function createSavingsPlan(
  data: Omit<SavingsPlan, "id" | "createdAt" | "updatedAt" | "user">
): Promise<CreateSavingsPlanResponse> {
  const payload = await getPayload({ config });
  const user = await currentUser();
  if (!user) {
    return {
      status: "error",
      message: "User not authenticated",
      data: null,
    };
  }

  let customer;
  try {
    customer = await getPayloadCustomerByClerkId(user.id);
    if (!customer) {
      throw new Error("An unexpected error occured");
    }
  } catch (e) {
    console.error("Error fetching customer:", e);
    return {
      status: "error",
      message: "Failed to create savings plan. Please, try again",
      data: null,
    };
  }

  try {
    const newPlan = await payload.create({
      collection: "savings-plans",
      data: { ...data, customer: customer.id || "" },
    });

    return {
      status: "success",
      message: "Savings plan created successfully",
      data: newPlan,
    };
  } catch (error) {
    console.error("Error creating savings plan:", error);
    return {
      status: "error",
      message: "Failed to create savings plan. Please, try again",
      data: null,
    };
  }
}
