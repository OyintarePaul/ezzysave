import { verifyPaystackTransaction } from "@/lib/paystack";
import { NextRequest } from "next/server";
import { getPayloadClient } from "@/lib/payload";

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

  const signature = req.headers.get("x-paystack-signature") || "";
  const body = await req.json();
  console.log("Paystack Webhook Body:", body);

  const crypto = await import("crypto");
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash !== signature) {
    return new Response(JSON.stringify({ message: "Invalid signature" }), {
      status: 400,
    });
  }

  // Handle the event (e.g., payment successful)
  if (body.event === "charge.success") {
    const { reference, metadata, amount } = body.data;
    const amountInNaira = amount / 100;
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
      return new Response(
        JSON.stringify({ message: "Payment not successful" }),
        { status: 200 }
      );
    }

    // Payment is successful and verified
    const payload = await getPayloadClient();
    try {
      // Update your database or perform necessary actions here
      console.log(
        `Payment verified for reference ${reference}. Updating records...`
      );

      if (metadata?.planId) {
        // It's a plan transaction
        const plan = await payload.findByID({
          collection: "savings-plans",
          id: metadata?.planId,
        });

        if (!plan) {
          console.log(
            `No existing record found for plan ID ${body.data.metadata.planId}.`
          );
          return new Response(
            JSON.stringify({ message: "No existing record found" }),
            { status: 200 }
          );
        }

        const newBalance = plan.currentBalance! + amountInNaira;

        //Update a payment record in Payload CMS
        const updatePlanPromise = payload.update({
          collection: "savings-plans",
          id: body.data.metadata.planId,
          data: {
            currentBalance: newBalance,
            status: newBalance >= plan.targetAmount! ? "Matured" : "Active",
          },
        });

        // create a new transaction
        const createTransactionPromise = payload.create({
          collection: "transactions",
          data: {
            amount: amountInNaira,
            category: "Savings",
            description: `${plan.planType} Savings Contribution: ${plan.planName}`,
            paystackRef: reference,
            plan: plan.id,
            customer: plan.customer,
            type: "Deposit",
          },
        });

        //run both savings and transaction at the same time
        const [updatePlanResult, createTransactionResult] =
          await Promise.allSettled([
            updatePlanPromise,
            createTransactionPromise,
          ]);

        console.log(
          `Payment record for reference ${reference}. Status: ${updatePlanResult.status}`
        );
        console.log(
          `Transaction record for reference ${reference}. Status: ${createTransactionResult.status}`
        );
      } else if (metadata?.loanId) {
        // It's a loan transaction
        console.log(`Processing Loan Repayment: ${metadata.loanId}`);
        const loan = await payload.findByID({
          collection: "loans",
          id: metadata.loanId,
        });

        if (!loan) {
          console.log(
            `No existing record found for loan ID ${body.data.metadata.loanId}.`
          );
          return new Response(
            JSON.stringify({ message: "No existing record found" }),
            { status: 200 }
          );
        }

        const newAmountPaid = (loan.amountPaid || 0) + amountInNaira;

        const updateLoanPromise = payload.update({
          collection: "loans",
          id: metadata.loanId,
          data: {
            amountPaid: newAmountPaid,
            status: loan.amount <= newAmountPaid ? "paidOff" : "approved",
          },
        });

        const createTransactionPromise = payload.create({
          collection: "transactions",
          data: {
            amount: amountInNaira,
            category: "Savings",
            description: `$Loan Repayment: ${loan.id}`,
            paystackRef: reference,
            loan: loan.id,
            customer: loan.customer,
            type: "Deposit",
          },
        });

        const [updateLoanResult, createTransactionResult] =
          await Promise.allSettled([
            updateLoanPromise,
            createTransactionPromise,
          ]);

        console.log(
          `Loan ${metadata.loanId} updated. Status: ${updateLoanResult.status}`
        );
        console.log(
          `Transaction record for reference ${reference}. Status: ${createTransactionResult.status}`
        );
      }
    } catch (error) {
      console.error(
        `Error updating payment record for reference ${reference}:`,
        error
      );
      return new Response(
        JSON.stringify({
          message: "Something went wrong. Unable to process webhook",
        }),
        { status: 401 }
      );
    }
  }
  return new Response(
    JSON.stringify({ message: "Webhook received and processed successfully." }),
    {
      status: 200,
    }
  );
};
