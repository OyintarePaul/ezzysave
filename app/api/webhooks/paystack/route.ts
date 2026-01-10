import { NextRequest } from "next/server";
import crypto from "crypto";
import {
  handleChargeSuccess,
  handleTransferSuccess,
  verifyPaystackTransaction,
} from "@/lib/paystack";

export const POST = async (req: NextRequest) => {
  console.log("Received Paystack webhook");
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    console.log("Paystack secret key not configured");
    return new Response(
      JSON.stringify({ message: "Paystack secret key not configured" }),
      { status: 500 }
    );
  }

  // Verify webhook source
  const signature = req.headers.get("x-paystack-signature") || "";
  const body = await req.json();
  console.log("Paystack Webhook Body:", body);

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash !== signature) {
    return new Response(JSON.stringify({ message: "Invalid signature" }), {
      status: 400,
    });
  }

  // We are good to go
  const { reference, metadata, amount } = body.data;

  // Verify transaction
  const verifyResponse = await verifyPaystackTransaction(reference);
  if (!verifyResponse.status) {
    console.log(`Failed to verify transaction with reference ${reference}.`);
    console.log("Verification response:", verifyResponse);
    return new Response(
      JSON.stringify({ message: "Transaction verification failed" }),
      { status: 200 }
    );
  }

  if (verifyResponse.data.status !== "success") {
    console.log(`Payment with reference ${reference} not successful.`);
    return new Response(JSON.stringify({ message: "Payment not successful" }), {
      status: 200,
    });
  }

  // Handle the event (e.g., payment successful)
  if (body.event === "charge.success") {
    return handleChargeSuccess({ metadata, amount, reference });
  } else if (body.event === "transfer.success") {
    return handleChargeSuccess({
      metadata,
      amount,
      reference,
    });
  }

  return new Response(
    JSON.stringify({
      message: "Webhook received and processed, but no changes were made",
    }),
    {
      status: 200,
    }
  );
};
