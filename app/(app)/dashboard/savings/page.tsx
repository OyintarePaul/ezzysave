import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Info, Plus } from "lucide-react";
import Link from "next/link";
import { SavingsPlan } from "@/payload-types";
import { Metadata } from "next";
import { SavingsPlanCard } from "./saving-plan-card";
import { getSavingsPlans } from "@/data/plans/getSavingPlans";
import CustomButton from "@/components/custom-button";

export const metadata: Metadata = {
  title: "Savings Plans",
};

export default async function SavingPlansPage() {
  const plans = await getSavingsPlans();
  const activePlans = plans.filter((p) => p.status === "Active");
  const maturedPlans = plans.filter((p) => p.status === "Matured");

  return (
    <div className="p-4 sm:p-8 space-y-8 pb-20 lg:pb-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          My Savings Plans
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          View and manage all your savings goals, both active and completed.
        </p>
      </header>

      {/* CTA Card for New Plan */}
      <div className="bg-primary/10 p-6 rounded-xl border-2 border-primary/20 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <Info className="h-6 w-6 text-primary " />
          <p className="text-primary font-medium">
            Ready to save smarter? Choose a plan that fits your goal!
          </p>
        </div>
        <CustomButton asChild>
          <Link href="/dashboard/savings/new" className="mt-4 sm:mt-0">
            <Plus className="h-5 w-5" />
            <span>New Plan</span>
          </Link>
        </CustomButton>
      </div>

      {/* --- Active Plans Section --- */}
      <h2 className="text-2xl font-bold text-gray-900 pt-4 dark:text-white">
        Active Goals ({activePlans.length})
      </h2>

      {/* List of Active Savings Plans (Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePlans.length > 0 ? (
          activePlans.map((plan) => (
            <SavingsPlanCard key={plan.id} plan={plan} />
          ))
        ) : (
          <p className="text-gray-500 italic md:col-span-3">
            No active plans found. Click 'New Plan' to start one!
          </p>
        )}
      </div>

      {/* --- Matured Plans Section --- */}
      <div className="pt-8 border-t mt-8 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
          Matured Plans History ({maturedPlans.length})
        </h2>

        {maturedPlans.length > 0 ? (
          <div className="space-y-3">
            {maturedPlans.map((plan) => (
              <MaturedPlanListItem key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No plans have fully matured yet. Keep working towards your goals!
          </p>
        )}
      </div>
    </div>
  );
}

// Component for a matured plan in the list format
const MaturedPlanListItem = ({ plan }: { plan: SavingsPlan }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 transition">
    <div className="flex items-center space-x-3">
      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      <div>
        <p className="font-medium text-gray-900 dark:text-white">
          {plan.planName}
        </p>
        <p className="text-sm text-gray-500">
          Matured on: {new Date(plan.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-lg text-gray-700 dark:text-gray-300">
        {formatCurrency(
          plan.targetAmount! + (plan.targetAmount! * plan.interestRate!) / 100,
        )}
      </p>
      <p className="text-xs text-gray-500">Final Payout</p>
    </div>
  </div>
);
