import "server-only";
const BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

const paystackApiClient = (endpoint: string, method: string = "GET") => {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error(
      "Paystack secret key is not defined in environment variables.",
    );
  }

  return fetch(`${BASE_URL}${endpoint}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((errorData) => {
        console.error(`Paystack API error on ${endpoint}:`, errorData);
        throw new Error(`Paystack API request failed: ${response.statusText}`);
      });
    }
    return response.json();
  });
};

export async function getBanks() {
  try {
    const response = await paystackApiClient("/bank?country=nigeria");
    return response.data;
  } catch (error) {
    console.error("Error fetching banks from Paystack:", error);
    throw new Error("Failed to fetch banks from Paystack.");
  }
}
