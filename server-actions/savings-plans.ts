"use server";
import bcrypt from "bcrypt";
import { SavingsPlan } from "@/payload-types";
import { getPayloadClient } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { getCurrentPayloadCustomer } from "@/data/customers/getCustomer";
import { savingsSchema, type SavingsFormData } from "@/lib/schema/savings";
import { type ServerActionResponse } from "@/lib/types";
import {
  WithdrawalFormData,
  withdrawalFormSchema,
} from "@/lib/schema/withdrawal-form";
import { initiateTransfer } from "@/data/paystack";

export async function createSavingsPlanAction(
  formData: SavingsFormData,
): Promise<ServerActionResponse<SavingsPlan>> {
  try {
    const { success, data, error } = savingsSchema.safeParse(formData);
    if (!success) {
      return {
        success: false,
        message: `Please check your input: ${error.issues[0].message}`,
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
  const FEE_PERCENTAGE = 2;

  try {
    // 1. Schema Validation
    const { success, data, error } = withdrawalFormSchema.safeParse(formData);
    if (!success) return { success: false, message: error.issues[0].message };

    const customer = await getCurrentPayloadCustomer();
    if (!customer.withdrawalPin)
      return { success: false, message: "Set a PIN first." };

    // 2. Security Check
    const isPinMatch = await bcrypt.compare(data.pin, customer.withdrawalPin);
    if (!isPinMatch) return { success: false, message: "Invalid PIN." };

    const payload = await getPayloadClient();

    // 3. CHECK FOR PENDING TRANSACTIONS
    // This prevents a second withdrawal from starting if one is already "in flight"
    const pendingTransactions = await payload.find({
      collection: "transactions",
      where: {
        plan: { equals: data.planId },
        status: { equals: "pending" },
        type: { equals: "Withdrawal" },
      },
    });

    if (pendingTransactions.totalDocs > 0) {
      return {
        success: false,
        message:
          "A withdrawal for this plan is already being processed. Please wait.",
      };
    }

    // 3. The "State" Check
    const plan = await payload.findByID({
      collection: "savings-plans",
      id: data.planId,
    });
    if (data.amount > (plan.currentBalance || 0)) {
      return { success: false, message: "Insufficient balance." };
    }

    // 4. Create internal record FIRST (The Lock)
    // This prevents double-tapping if you check for existing pending txs
    const txRef = uuid();
    const txResponse = await payload.create({
      collection: "transactions",
      data: {
        plan: data.planId,
        customer: customer.id,
        amount: data.amount,
        type: "Withdrawal",
        status: "pending",
        paystackRef: txRef,
        description: `Withdrawal: ${plan.planName}`,
      },
    });

    // 5. Financial Calculation (Integer Math)
    const amountToDisburse = Math.floor(
      (data.amount * (100 - FEE_PERCENTAGE)) / 100,
    );

    // 6. External Transfer
    const transfer = await initiateTransfer({
      amount: amountToDisburse,
      recipientCode: customer.recipientCode!,
      reason: `Withdrawal - ${plan.planName}`,
      reference: txRef,
    });

    if (!transfer.success) {
      // Handle Paystack immediate failure
      await payload.update({
        collection: "transactions",
        id: txResponse.id,
        data: { status: "failed" },
      });
      return {
        success: false,
        message:
          transfer.message ||
          "Failed to initiate withdrawal. Please try again.",
      };
    }

    // NOTE: We keep the transaction as "pending" until we receive a webhook from Paystack confirming success/failure.
    revalidatePath(`/dashboard/savings-plans/${data.planId}`);

    return {
      success: true,
      message:
        "Withdrawal initiated. Your account will be credited within 24 hours.",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
