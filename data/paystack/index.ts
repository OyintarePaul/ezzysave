import "server-only";
import { cache } from "react";
import {
  BankArray,
  bankArraySchema,
  ReceipientCode,
  receipientCodeSchema,
  ResolveAccount,
  resolveAccountSchema,
} from "@/lib/schema/paystack";
import { ActionResponse } from "@/lib/types";
const BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const paystackClient = async (
  endpoint: string,
  method: string = "GET",
  body?: Record<string, any>,
) => {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error(
      "Paystack secret key is not defined in environment variables.",
    );
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle non-200 responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Paystack API error on ${endpoint}:`, errorData);

    throw new Error(
      errorData.message ||
        `Paystack API request failed: ${response.statusText}`,
    );
  }

  const resultJson = await response.json();

  if (!resultJson.status) {
    console.error(`Paystack Business Logic Error on ${endpoint}:`, resultJson);
    throw new Error(
      resultJson.message || "Paystack reported an unsuccessful operation.",
    );
  }

  return resultJson;
};

export const getBanks: () => Promise<BankArray> = cache(async function () {
  const response = await paystackClient("/bank?country=nigeria");
  return bankArraySchema.parse(response.data);
});

export async function resolveAccount({
  accountNumber,
  bankCode,
}: {
  accountNumber: string;
  bankCode: string;
}): Promise<ActionResponse<ResolveAccount>> {
  try {
    const response = await paystackClient(
      `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    );

    // Parse the data using your Zod schema
    const validatedData = resolveAccountSchema.parse(response.data);

    return {
      success: true,
      message: "Account resolved successfully",
      data: validatedData,
    };
  } catch (error: any) {
    // This catches Paystack API errors (404, 422) and Zod parsing errors
    console.error("Account Resolution Failed:", error.message);

    return {
      success: false,
      message:
        "Could not verify your account details. Please check the number and bank.",
    };
  }
}

export async function createRecipientCode({
  accountName,
  accountNumber,
  bankCode,
}: {
  accountNumber: string;
  bankCode: string;
  accountName: string;
}): Promise<ActionResponse<ReceipientCode>> {
  try {
    const response = await paystackClient("/trasnferrecipient", "POST", {
      type: "nuban",
      name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: "NGN",
    });

    return {
      success: true,
      data: receipientCodeSchema.parse(response.data),
      message: "Recipient code created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create recipient code.",
    };
  }
}

export async function initiateTransfer({
  recipientCode,
  amount,
  reason,
  reference,
}: {
  recipientCode: string;
  amount: number;
  reason: string;
  reference: string;
}) {
  try {
    const koboAmount = Math.round(amount * 100);
    const result = await paystackClient("/transfer", "POST", {
      source: "balance",
      amount: koboAmount,
      recipient: recipientCode,
      reference,
      reason,
    });

    // If we reached here, Paystack successfully queued the transfer
    return {
      success: true,
      message: result.message || "Transfer initiated successfully.",
      data: result.data, // Contains transfer_code and other details
    };
  } catch (error: any) {
    // 4. Handle the error thrown by paystackClient
    console.error("Transfer Initiation Failed:", error.message);
    return {
      success: false,
      message: "An unexpected error occurred with the payment provider.",
    };
  }
}
