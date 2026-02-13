"use server";
import { SavingsPlan } from "@/payload-types";
import { getPayloadClient } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { initiateTransfer } from "@/lib/paystack";
import { getCurrentPayloadCustomer } from "@/data/customers/getCustomer";
import { savingsSchema, type SavingsFormData } from "@/lib/schema/savings";
import { type ServerActionResponse } from "@/lib/types";
import {
  WithdrawalFormData,
  withdrawalFormSchema,
} from "@/lib/schema/withdrawal-form";

export async function createSavingsPlanAction(
  formData: SavingsFormData,
): Promise<ServerActionResponse<SavingsPlan>> {
  try {
    const { success, data } = savingsSchema.safeParse(formData);
    if (!success) {
      return {
        success: false,
        message: "Bad input. Please check your input",
      };
    }
    const payload = await getPayloadClient();
    const customer = await getCurrentPayloadCustomer();
    console.log("Creating  new plan with data", data);
    const newPlan = await payload.create({
      collection: "savings-plans",
      data: { ...data, customer: customer.id || "" },
    });

    return {
      success: true,
      message: "Savings plan created successfully",
      data: newPlan,
    };
  } catch (e) {
    console.error("Error fetching customer:", e);
    return {
      success: false,
      message: "Failed to create savings plan. Please, try again",
    };
  }
}

export async function withdrawFromPlan(
  formData: WithdrawalFormData,
): Promise<ServerActionResponse> {
  try {
    // validate incoming data
    const { success, data } = withdrawalFormSchema.safeParse(formData);

    if (!success) {
      return {
        success: false,
        message: "Bad input. Please check your input",
      };
    }

    const customer = await getCurrentPayloadCustomer();
    const payload = await getPayloadClient();

    // get loan details
    const plan = await payload.findByID({
      collection: "savings-plans",
      id: data.planId,
    });

    // check if amount is greater than current balance
    if (data.amount > (plan.currentBalance || 0)) {
      return {
        success: false,
        message: "Withdrawal amount exceeds current balance.",
      };
    }

    // check if there's a pending transaction for this plan
    const pendingTransactions = await payload.find({
      collection: "transactions",
      where: {
        plan: { equals: data.planId },
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
        message: "There is already a pending disbursement for this plan.",
      };
    }

    // create pending transaction to disburse loan amount to get a payment ref
    const txResponse = await payload.create({
      collection: "transactions",
      data: {
        plan: data.planId,
        customer: customer.id,
        category: "Savings",
        description: `${plan.planType} Savings Withdrawal: ${plan.planName}`,
        amount: data.amount,
        type: "Withdrawal",
        status: "pending",
        paystackRef: uuid(),
      },
    });

    // initiate transfer via paystack
    const initiateTransferResponse = await initiateTransfer({
      amount: data.amount * 100 * 0.98, // convert to kobo and account for 2% fee
      recipientCode: customer.recipientCode!,
      reason: `Withdrawal - ${plan.planName}`,
      reference: txResponse.paystackRef!,
    });

    console.log(
      `Disbursed amount ${data.amount} to customer ${customer.id} for plan ${data.planId}`,
      initiateTransferResponse,
    );

    revalidatePath("/dashboard/savings-plans");
    return {
      success: true,
      message:
        "Withdrawal initiated successfully. You will be credited shortly.",
    };
  } catch (error) {
    console.error("Error withdrawing from savings plan:", error);
    return { success: false, message: "Failed to withdraw from savings plan." };
  }
}
