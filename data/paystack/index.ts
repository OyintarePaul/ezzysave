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
const BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const paystackClient = async (
  endpoint: string,
  method: string = "GET",
  body?: BodyInit,
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
}): Promise<ResolveAccount> {
  const response = await paystackClient(
    `/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
  );
  return resolveAccountSchema.parse(response.data);
}

export async function createRecipientCode({
  accountName,
  accountNumber,
  bankCode,
}: {
  accountNumber: string;
  bankCode: string;
  accountName: string;
}): Promise<ReceipientCode> {
  const response = await paystackClient(
    "/trasnferrecipient",
    "POST",
    JSON.stringify({
      type: "nuban",
      name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: "NGN",
    }),
  );

  return receipientCodeSchema.parse(response.data["recipient_code"]);
}
