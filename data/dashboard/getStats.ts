import "server-only";
import { getPayloadClient } from "@/lib/payload";
import { getCurrentPayloadCustomer } from "../customers/getCustomer";

export async function getDashboardStats() {
  const { id: customerId } = await getCurrentPayloadCustomer();
  const payload = await getPayloadClient();

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

  const approvedLoan = loan.docs[0]?.amount || 0;

  const totalSaved = plans.docs.reduce(
    (acc, plan) => acc + (plan.currentBalance || 0),
    0,
  );

  const totalTarget = plans.docs.reduce(
    (acc, plan) => acc + (plan.targetAmount || 0),
    0,
  );

  const activePlans = plans.docs.filter((p) => p.status === "Active").length;

  const accruedInterest = plans.docs.reduce(
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
