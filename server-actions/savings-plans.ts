"use server";
import { SavingsPlan } from "@/payload-types";
import { getPayload } from "payload";
import config from "@payload-config";
import { currentUser } from "@clerk/nextjs/server";
import { getPayloadClient } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { initiateTransfer } from "@/lib/paystack";
import { getCurrentPayloadCustomer } from "@/data/customers/getCustomer";

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
  data: Omit<SavingsPlan, "id" | "createdAt" | "updatedAt" | "user">,
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
    customer = await getCurrentPayloadCustomer();
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

export async function withdrawFromPlan(planId: string, amount: number) {
  try {
    const customer = await getCurrentPayloadCustomer();
    if (!customer) {
      return { success: false, error: "Customer not found." };
    }

    const payload = await getPayloadClient();

    // get loan details
    const plan = await payload.findByID({
      collection: "savings-plans",
      id: planId,
    });

    // check if amount is greater than current balance
    if (amount > (plan.currentBalance || 0)) {
      return {
        success: false,
        error: "Withdrawal amount exceeds current balance.",
      };
    }

    // check if there's a pending transaction for this plan
    const pendingTransactions = await payload.find({
      collection: "transactions",
      where: {
        plan: { equals: planId },
        or: [
          {
            status: { equals: "pending" },
          },
        ],
      },
    });

    if (pendingTransactions.totalDocs > 0) {
      console.log(
        "Pending transactions found:",
        pendingTransactions.docs[0].id,
      );
      return {
        success: false,
        error: "There is already a pending disbursement for this plan.",
      };
    }

    // create pending transaction to disburse loan amount to get a payment ref
    const txResponse = await payload.create({
      collection: "transactions",
      data: {
        plan: planId,
        customer: customer.id,
        category: "Savings",
        description: `${plan.planType} Savings Withdrawal: ${plan.planName}`,
        amount,
        type: "Withdrawal",
        status: "pending",
        paystackRef: uuid(),
      },
    });

    // initiate transfer via paystack
    const initiateTransferResponse = await initiateTransfer({
      amount: amount * 100 * 0.98, // convert to kobo and account for 2% fee
      recipientCode: customer.recipientCode!,
      reason: `Withdrawal - ${plan.planName}`,
      reference: txResponse.paystackRef!,
    });

    console.log(
      `Disbursed amount ${amount} to customer ${customer.id} for plan ${planId}`,
      initiateTransferResponse,
    );

    revalidatePath("/dashboard/savings-plans");
    return { success: true };
  } catch (error) {
    console.error("Error withdrawing from savings plan:", error);
    return { success: false, error: "Failed to withdraw from savings plan." };
  }
}
