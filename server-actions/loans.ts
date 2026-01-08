"use server";

import { getCurrentUser } from "@/lib/auth";
import { getPayloadClient, getPayloadCustomerByClerkId } from "@/lib/payload";
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
  loanData: submitLoadApplicationParams
): Promise<submitLoanApplicationResponse> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const customer = await getPayloadCustomerByClerkId(user.id);
  if (!customer) {
    redirect("/auth/login");
  }

  try {
    console.log(
      "Submitting loan application: ",
      loanData,
      " for customer: ",
      customer.id
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
    revalidatePath("/dashboard/loans")
    return { success: true };
  } catch (error) {
    console.error("Error submitting loan application:", error);
    return { success: false, error: "Failed to submit loan application." };
  }
}
