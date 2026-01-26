"use server";
import { v4 as uuid } from "uuid";
import { getCurrentUser } from "@/lib/auth";
import { getPayloadClient, getPayloadCustomerByClerkId } from "@/lib/payload";
import { initiateTransfer } from "@/lib/paystack";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface submitLoadApplicationParams {
  amount: number;
  purpose: string;
  duration: number;
}

interface submitLoanApplicationResponse {
  success: boolean;
  error?: string;
}

export async function submitLoanApplication(
  loanData: submitLoadApplicationParams,
): Promise<submitLoanApplicationResponse> {
  const user = await getCurrentUser();
  const customer = await getPayloadCustomerByClerkId(user.id);
  if (!customer) {
    return { success: false, error: "Failed to submit loan application." };
  }

  try {
    console.log(
      "Submitting loan application: ",
      loanData,
      " for customer: ",
      customer.id,
    );

    const payload = await getPayloadClient();
    const response = await payload.create({
      collection: "loans",
      data: {
        ...loanData,
        customer: customer.id,
      },
    });
    console.log("Loan application submitted successfully:", response);
    revalidatePath("/dashboard/loans");
    return { success: true };
  } catch (error) {
    console.error("Error submitting loan application:", error);
    return { success: false, error: "Failed to submit loan application." };
  }
}

export async function rejectLoan(loanId: string) {
  const user = await getCurrentUser();

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
  try {
    const user = await getCurrentUser();
    const customer = await getPayloadCustomerByClerkId(user.id);
    if (!customer) {
      return { success: false, error: "Customer not found." };
    }

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
        error: "There is already a pending disbursement for this loan.",
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
