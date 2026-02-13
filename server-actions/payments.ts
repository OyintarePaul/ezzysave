"use server";
import { getCurrentPayloadCustomer } from "@/data/customers/getCustomer";
import { initPaystack } from "@/lib/paystack";
import { ServerActionResponse } from "@/lib/types";
import { z } from "zod";

const baseSchema = z.object({
  amount: z.number(),
});

const metadataUnion = z.union([
  z.object({
    planId: z.string(),
  }),
  z.object({
    loanId: z.string(),
  }),
]);

// 2. Combine them into one clean schema
const getPaymentLinkSchema = baseSchema.extend({
  metadata: metadataUnion,
});

export async function getPaymentLink(
  amount: number,
  metadata:
    | {
        planId: string;
      }
    | {
        loanId: string;
      },
): Promise<ServerActionResponse<string>> {
  try {
    const { success, data } = getPaymentLinkSchema.safeParse({
      amount,
      metadata,
    });

    if (!success) {
      return {
        success: false,
        message: "Bad input. Please check your input.",
      };
    }

    const customer = await getCurrentPayloadCustomer();

    const response = await initPaystack({
      email: customer.email,
      amount: data.amount,
      metadata: data.metadata,
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
    });

    return {
      success: true,
      data: response.data.authorization_url,
      message: "Redirecting to payment page...",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Unable to generate payment link",
    };
  }
}
