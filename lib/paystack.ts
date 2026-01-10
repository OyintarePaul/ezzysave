import "server-only";
import { getPayloadClient } from "./payload";

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

export const handleChargeSuccess = async ({
  amount,
  metadata,
  reference,
}: {
  amount: number;
  metadata: {
    planId?: string;
    loanId?: number;
  };
  reference: string;
}) => {
  // Payment is successful and verified
  const amountInNaira = amount / 100;
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
        console.log(`No existing record found for plan ID ${metadata.planId}.`);
        return new Response(
          JSON.stringify({ message: "No existing record found" }),
          { status: 200 }
        );
      }

      const newBalance = plan.currentBalance! + amountInNaira;

      //Update a payment record in Payload CMS
      const updatePlanPromise = payload.update({
        collection: "savings-plans",
        id: metadata.planId,
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
        await Promise.allSettled([updatePlanPromise, createTransactionPromise]);

      console.log(
        `Payment record for reference ${reference}. Status: ${updatePlanResult.status}`
      );
      console.log(
        `Transaction record for reference ${reference}. Status: ${createTransactionResult.status}`
      );
      return new Response(
        JSON.stringify({
          message: "Webhook received and processed successfully.",
        }),
        {
          status: 200,
        }
      );
    } else if (metadata?.loanId) {
      // It's a loan transaction
      console.log(`Processing Loan Repayment: ${metadata.loanId}`);
      const loan = await payload.findByID({
        collection: "loans",
        id: metadata.loanId,
      });

      if (!loan) {
        console.log(`No existing record found for loan ID ${metadata.loanId}.`);
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
          category: "Loans",
          description: `$Loan Repayment: ${loan.id}`,
          paystackRef: reference,
          loan: loan.id,
          customer: loan.customer,
          type: "Deposit",
        },
      });

      const [updateLoanResult, createTransactionResult] =
        await Promise.allSettled([updateLoanPromise, createTransactionPromise]);

      console.log(
        `Loan ${metadata.loanId} updated. Status: ${updateLoanResult.status}`
      );
      console.log(
        `Transaction record for reference ${reference}. Status: ${createTransactionResult.status}`
      );
    }
    return new Response(
      JSON.stringify({
        message: "Webhook received and processed successfully.",
      }),
      {
        status: 200,
      }
    );
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
};

export const handleTransferSuccess = async ({
  amount,
  metadata,
  reference,
}: {
  amount: number;
  metadata: {
    planId?: string;
    loanId?: number;
  };
  reference: string;
}) => {
  const amountInNaira = amount / 100;
  const payload = await getPayloadClient();
  try {
    // Update your database or perform necessary actions here
    console.log(
      `Payment verified for reference ${reference}. Updating records...`
    );

    if (metadata?.planId) {
      // It's a plan withdrawal transaction
      const plan = await payload.findByID({
        collection: "savings-plans",
        id: metadata?.planId,
      });

      if (!plan) {
        console.log(`No existing record found for plan ID ${metadata.planId}.`);
        return new Response(
          JSON.stringify({ message: "No existing record found" }),
          { status: 200 }
        );
      }

      const newBalance = plan.currentBalance! - amountInNaira;

      //Update a payment record in Payload CMS
      const updatePlanPromise = payload.update({
        collection: "savings-plans",
        id: metadata.planId,
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
          description: `${plan.planType} Savings Withdrawal: ${plan.planName}`,
          paystackRef: reference,
          plan: plan.id,
          customer: plan.customer,
          type: "Withdrawal",
        },
      });

      //run both savings and transaction at the same time
      const [updatePlanResult, createTransactionResult] =
        await Promise.allSettled([updatePlanPromise, createTransactionPromise]);

      console.log(
        `Payment record for reference ${reference}. Status: ${updatePlanResult.status}`
      );
      console.log(
        `Transaction record for reference ${reference}. Status: ${createTransactionResult.status}`
      );
      return new Response(
        JSON.stringify({
          message: "Webhook received and processed successfully.",
        }),
        {
          status: 200,
        }
      );
    } else if (metadata?.loanId) {
      // It's a loan transaction
      console.log(`Processing Loan Repayment: ${metadata.loanId}`);
      const loan = await payload.findByID({
        collection: "loans",
        id: metadata.loanId,
      });

      if (!loan) {
        console.log(`No existing record found for loan ID ${metadata.loanId}.`);
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
          category: "Loans",
          description: `$Loan Disbursement: ${loan.id}`,
          paystackRef: reference,
          loan: loan.id,
          customer: loan.customer,
          type: "Withdrawal",
        },
      });

      const [updateLoanResult, createTransactionResult] =
        await Promise.allSettled([updateLoanPromise, createTransactionPromise]);

      console.log(
        `Loan ${metadata.loanId} updated. Status: ${updateLoanResult.status}`
      );
      console.log(
        `Transaction record for reference ${reference}. Status: ${createTransactionResult.status}`
      );
    }
    return new Response(
      JSON.stringify({
        message: "Webhook received and processed successfully.",
      }),
      {
        status: 200,
      }
    );
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
};

// export const handleChargeSuccess = async ({
//   amount,
//   metadata,
//   reference,
//   isOutgoing = false,
// }: {
//   amount: number;
//   metadata: {
//     planId?: string;
//     loanId?: number;
//   };
//   reference: string;
//   isOutgoing?: boolean;
// }) => {
//   // Payment is successful and verified
//   const amountInNaira = amount / 100;
//   const payload = await getPayloadClient();
//   try {
//     // Update your database or perform necessary actions here
//     console.log(
//       `Payment verified for reference ${reference}. Updating records...`
//     );

//     if (metadata?.planId) {
//       // It's a plan transaction
//       const plan = await payload.findByID({
//         collection: "savings-plans",
//         id: metadata?.planId,
//       });

//       if (!plan) {
//         console.log(`No existing record found for plan ID ${metadata.planId}.`);
//         return new Response(
//           JSON.stringify({ message: "No existing record found" }),
//           { status: 200 }
//         );
//       }

//       const newBalance = isOutgoing
//         ? plan.currentBalance! - amountInNaira
//         : plan.currentBalance! + amountInNaira;

//       //Update a payment record in Payload CMS
//       const updatePlanPromise = payload.update({
//         collection: "savings-plans",
//         id: metadata.planId,
//         data: {
//           currentBalance: newBalance,
//           status: newBalance >= plan.targetAmount! ? "Matured" : "Active",
//         },
//       });

//       // create a new transaction
//       const createTransactionPromise = payload.create({
//         collection: "transactions",
//         data: {
//           amount: amountInNaira,
//           category: "Savings",
//           description: `${plan.planType} Savings ${isOutgoing ? "Withdrawal" : "Deposit"}: ${plan.planName}`,
//           paystackRef: reference,
//           plan: plan.id,
//           customer: plan.customer,
//           type: isOutgoing ? "Withdrawal" : "Deposit",
//         },
//       });

//       //run both savings and transaction at the same time
//       const [updatePlanResult, createTransactionResult] =
//         await Promise.allSettled([updatePlanPromise, createTransactionPromise]);

//       console.log(
//         `Payment record for reference ${reference}. Status: ${updatePlanResult.status}`
//       );
//       console.log(
//         `Transaction record for reference ${reference}. Status: ${createTransactionResult.status}`
//       );
//       return new Response(
//         JSON.stringify({
//           message: "Webhook received and processed successfully.",
//         }),
//         {
//           status: 200,
//         }
//       );
//     } else if (metadata?.loanId) {
//       // It's a loan transaction
//       console.log(`Processing Loan Repayment: ${metadata.loanId}`);
//       const loan = await payload.findByID({
//         collection: "loans",
//         id: metadata.loanId,
//       });

//       if (!loan) {
//         console.log(`No existing record found for loan ID ${metadata.loanId}.`);
//         return new Response(
//           JSON.stringify({ message: "No existing record found" }),
//           { status: 200 }
//         );
//       }

//       const newAmountPaid = (loan.amountPaid || 0) + amountInNaira;

//       const updateLoanPromise = payload.update({
//         collection: "loans",
//         id: metadata.loanId,
//         data: isOutgoing
//           ? {
//               status: "active",
//             }
//           : {
//               amountPaid: newAmountPaid,
//               status: loan.amount <= newAmountPaid ? "paidOff" : "approved",
//             },
//       });

//       const createTransactionPromise = payload.create({
//         collection: "transactions",
//         data: {
//           amount: amountInNaira,
//           category: "Loans",
//           description: `$Loan ${isOutgoing ? "Disbursement" : "Repayment"}: ${loan.id}`,
//           paystackRef: reference,
//           loan: loan.id,
//           customer: loan.customer,
//           type: isOutgoing ? "Withdrawal" : "Deposit",
//         },
//       });

//       const [updateLoanResult, createTransactionResult] =
//         await Promise.allSettled([updateLoanPromise, createTransactionPromise]);

//       console.log(
//         `Loan ${metadata.loanId} updated. Status: ${updateLoanResult.status}`
//       );
//       console.log(
//         `Transaction record for reference ${reference}. Status: ${createTransactionResult.status}`
//       );
//     }
//     return new Response(
//       JSON.stringify({
//         message: "Webhook received and processed successfully.",
//       }),
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.error(
//       `Error updating payment record for reference ${reference}:`,
//       error
//     );
//     return new Response(
//       JSON.stringify({
//         message: "Something went wrong. Unable to process webhook",
//       }),
//       { status: 401 }
//     );
//   }
// };
