import "server-only";
import { getPayloadClient } from "@/lib/payload";
import { z } from "zod";
import { getCurrentPayloadCustomer } from "../customers/getCustomer";

export async function getDashboardStats() {
  const { id: customerId } = await getCurrentPayloadCustomer();
  const payload = await getPayloadClient();
  let totalSaved, totalTarget, activePlans, accruedInterest, approvedLoan;

  const plansPromise = payload.find({
    collection: "savings-plans",
    where: {
      customer: { equals: customerId },
    },
    select: {
      currentBalance: true,
      targetAmount: true,
      status: true,
      interestEarned: true,
    },
  });

  const loanPromise = payload.find({
    collection: "loans",
    where: {
      customer: { equals: customerId },
      status: { equals: "approved" },
    },
    select: {
      amount: true,
    },
  });

  const [plans, loan] = await Promise.all([plansPromise, loanPromise]);

  approvedLoan = loan.docs[0]?.amount || 0;

  totalSaved = plans.docs.reduce(
    (acc, plan) => acc + (plan.currentBalance || 0),
    0,
  );

  totalTarget = plans.docs.reduce(
    (acc, plan) => acc + (plan.targetAmount || 0),
    0,
  );

  activePlans = plans.docs.filter((p) => p.status === "Active").length;

  accruedInterest = plans.docs.reduce(
    (acc, plan) => acc + (plan.interestEarned || 0),
    0,
  );

  return {
    totalSaved,
    totalTarget,
    activePlans,
    accruedInterest,
    approvedLoan,
  };
}
