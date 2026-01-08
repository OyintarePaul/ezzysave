"use server";
import { initPaystack } from "@/lib/paystack";
import { currentUser } from "@clerk/nextjs/server";

type GetPaymentLinkResponse =
  | {
      success: true;
      link: string;
    }
  | {
      success: false;
    };

export async function getPaymentLink(
  amount: number,
  metadata:
    | {
        planId: string;
      }
    | {
        loanId: string;
      }
): Promise<GetPaymentLinkResponse> {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const response = await initPaystack({
      email: user.emailAddresses[0]?.emailAddress,
      amount,
      metadata,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    });

    console.log("Payment details: ", response);

    return {
      success: true,
      link: response.data.authorization_url,
    };
  } catch (error) {
    console.log("Error in payment link:", error);
    return {
      success: false,
    };
  }
}
