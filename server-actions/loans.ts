"use server";
import { v4 as uuid } from "uuid";
import { getPayloadClient } from "@/lib/payload";
import { initiateTransfer } from "@/lib/paystack";
import { revalidatePath } from "next/cache";
import { getCurrentPayloadCustomer } from "@/data/customers/getCustomer";
import { ServerActionResponse } from "@/lib/types";
import { LoanFormData, loanFormSchema } from "@/lib/schema/loan-form";

export async function submitLoanApplication(
  loanData: LoanFormData,
): Promise<ServerActionResponse> {
  try {
    // validate data
    const { success, data } = loanFormSchema.safeParse(loanData);
    if (!success) {
      return {
        success: false,
        message: "Bad input. Please check your input.",
      };
    }

    const customer = await getCurrentPayloadCustomer();
    const payload = await getPayloadClient();
    await payload.create({
      collection: "loans",
      data: {
        ...data,
        customer: customer.id,
      },
    });
    revalidatePath("/dashboard/loans");
    return { success: true, message: "Loan application was successful." };
  } catch (error) {
    console.error("Error submitting loan application:", error);
    return { success: false, message: "Failed to submit loan application." };
  }
}

export async function rejectLoan(loanId: string) {
  try {
    const payload = await getPayloadClient();

    const pendingTransactions = await payload.find({
      collection: "transactions",
      where: {
        loan: { equals: loanId },
        or: [
          {
            status: { equals: "pending" },
          },
          {
            status: { equals: "completed" },
          },
        ],
      },
    });

    if (pendingTransactions.totalDocs > 0) {
      return {
        success: false,
        error: "There is already a pending disbursement for this loan.",
      };
    }

    const response = await payload.update({
      collection: "loans",
      id: loanId,
      data: {
        status: "rejected",
      },
    });
    console.log("Loan declined successfully:", response);
    revalidatePath("/dashboard/loans");
    return { success: true };
  } catch (error) {
    console.error("Error declining loan:", error);
    return { success: false, error: "Failed to decline loan." };
  }
}

export async function acceptAndDisburseLoan(loanId: string) {
  // verify by withdrawal pin
  try {
    const customer = await getCurrentPayloadCustomer();
    const payload = await getPayloadClient();

    // get loan details
    const loan = await payload.findByID({
      collection: "loans",
      id: loanId,
    });

    // check if there's a pending transaction for this loan
    const pendingTransactions = await payload.find({
      collection: "transactions",
      where: {
        loan: { equals: loanId },
        or: [
          {
            status: { equals: "pending" },
          },
          {
            status: { equals: "completed" },
          },
        ],
      },
    });

    if (pendingTransactions.totalDocs > 0) {
      return {
        success: false,
        error: "There is already a pending or completed disbursement for this loan.",
      };
    }

    // create pending transaction to disburse loan amount to get a payment ref
    const txResponse = await payload.create({
      collection: "transactions",
      data: {
        loan: loanId,
        customer: customer.id,
        category: "Loans",
        description: `Disbursement for loan ${loanId}`,
        amount: loan.amount,
        type: "Withdrawal",
        status: "pending",
        paystackRef: uuid(),
      },
    });

    // initiate transfer via paystack
    const amount = loan.amount;

    const initiateTransferResponse = await initiateTransfer({
      amount,
      recipientCode: customer.recipientCode!,
      reason: `Disbursement for loan ${loanId}`,
      reference: txResponse.paystackRef!,
    });

    console.log(
      `Disbursed amount ${amount} to customer ${customer.id} for loan ${loanId}`,
      initiateTransferResponse,
    );

    revalidatePath("/dashboard/loans");
    return { success: true };
  } catch (error) {
    console.error("Error accepting and disbursing loan:", error);
    return { success: false, error: "Failed to accept and disburse loan." };
  }
}
