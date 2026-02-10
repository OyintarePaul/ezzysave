import crypto from "crypto";
import { NextRequest } from "next/server";
import {
  handleChargeSuccess,
  handleTransferSuccess,
  verifyPaystackTransaction,
} from "@/lib/paystack";

export const POST = async (req: NextRequest) => {
  try {
    console.log("Received Paystack webhook at ", new Date().toISOString());
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      console.log("Paystack secret key not configured");
      return new Response(
        JSON.stringify({ message: "Paystack secret key not configured" }),
        { status: 500 },
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

    const { reference, metadata, amount } = body.data;

    // Handle the event (e.g., payment successful)
    if (body.event === "charge.success") {
      return handleChargeSuccess({ metadata, amount, reference });
    } else if (body.event === "transfer.success") {
      return handleTransferSuccess({ amount, reference });
    } else {
      return new Response(
        JSON.stringify({
          message: "Webhook received and processed, but no changes were made",
        }),
        {
          status: 200,
        },
      );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ message: "Error processing webhook" }),
      { status: 500 },
    );
  }
};
