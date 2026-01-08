interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export const initPaystack = async ({
  email,
  amount,
  firstName,
  callback_url,
  lastName,
  metadata,
}: {
  email: string;
  amount: number;
  metadata:
    | {
        planId: string;
      }
    | {
        loanId: string;
      };
  callback_url?: string;
  firstName: string;
  lastName: string;
}): Promise<PaystackInitResponse> => {
  const params = JSON.stringify({
    email,
    amount: amount * 100, //amount in kobo
    first_name: firstName,
    last_name: lastName,
    callback_url: callback_url || process.env.PAYSTACK_CALLBACK_URL,
    metadata,
  });

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      body: params,
      headers: {
        Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Paystack initialization error:", errorData);
    throw new Error(`Paystack initialization failed: ${response.statusText}`);
  }
  return response.json();
};

export const verifyPaystackTransaction = async (reference: string) => {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Paystack verification error:", errorData);
    throw new Error(`Paystack verification failed: ${response.statusText}`);
  }
  return response.json();
};
