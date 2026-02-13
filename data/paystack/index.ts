import { Bank } from "@/lib/types";
import { cache } from "react";
import "server-only";
const BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const paystackApiClient = async (
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

  const result = await response.json();

  if (!result.status) {
    console.error(`Paystack Business Logic Error on ${endpoint}:`, result);
    throw new Error(
      result.message || "Paystack reported an unsuccessful operation.",
    );
  }

  return result;
};

export const getBanks: () => Promise<Bank[]> = cache(async function () {
  try {
    const response = await paystackApiClient("/bank?country=nigeria");
    return response.data;
  } catch (error) {
    console.error("Error fetching banks from Paystack:", error);
    throw new Error("Failed to fetch banks from Paystack.");
  }
});

export async function resolveAccount({
  accountNumber,
  bankCode,
}: {
  accountNumber: string;
  bankCode: string;
}) {
  try {
    const response = await paystackApiClient(
      `/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    );
    return response.data;
  } catch (e) {
    console.error("Error resolving account from Paystack:", e);
    throw new Error("Failed to resolve from Paystack.");
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
}) {
  try {
    const response = await paystackApiClient(
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

    return response.data;
  } catch (e) {
    console.error("Error Creating recipient code:", e);
    throw new Error("Failed to create recipient code.");
  }
}
