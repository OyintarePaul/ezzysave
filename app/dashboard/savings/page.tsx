import { Button } from "@/components/ui/button";
import { mockSavingsPlans, SavingsPlan } from "@/constants/mock";
import { pageAuthGuard } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Info, Lock, Plus, Target, Zap } from "lucide-react";
import Link from "next/link";

const SavingsPlanCard: React.FC<{ plan: SavingsPlan }> = ({ plan }) => {
  const getIconAndColor = (type: SavingsPlan["type"]) => {
    switch (type) {
      case "Target":
        return {
          icon: <Target className="h-6 w-6 text-green-500" />,
          color: "text-green-500",
          barColor: "bg-green-500",
        };
      case "Fixed":
        return {
          icon: <Lock className="h-6 w-6 text-blue-500" />,
          color: "text-blue-500",
          barColor: "bg-blue-500",
        };
      case "Daily":
        return {
          icon: <Zap className="h-6 w-6 text-yellow-500" />,
          color: "text-yellow-500",
          barColor: "bg-yellow-500",
        };
    }
  };

  const { icon, color, barColor } = getIconAndColor(plan.type);
  const progress = (plan.currentAmount / plan.targetAmount) * 100;
  const isFixed = plan.type === "Fixed";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {plan.name}
            </h3>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${color} ${
              plan.status === "Active"
                ? "bg-opacity-20 bg-blue-100"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            {plan.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
          {plan.type} Savings Plan
        </p>

        {/* Progress Bar or Fixed amount display */}
        {isFixed ? (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(plan.currentAmount)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Locked for 6 months @ {plan.interestRate}% APY
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(plan.currentAmount)} Saved
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Goal: {formatCurrency(plan.targetAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${barColor}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
              {progress.toFixed(1)}% Complete
            </p>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button size="sm" variant="link" asChild>
          <Link href="/savings/1">View Details →</Link>
        </Button>
      </div>
    </div>
  );
};

// Component for a matured plan in the list format
const MaturedPlanListItem: React.FC<{ plan: SavingsPlan }> = ({ plan }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 transition">
    <div className="flex items-center space-x-3">
      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{plan.name}</p>
        <p className="text-sm text-gray-500">Matured on: 2024/09/15</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-lg text-gray-700 dark:text-gray-300">
        {formatCurrency(plan.targetAmount + (plan.targetAmount * plan.interestRate) / 100)}
      </p>
      <p className="text-xs text-gray-500">Final Payout</p>
    </div>
  </div>
);

const SavingsPlansPage: React.FC = () => {
  const activePlans = mockSavingsPlans.filter((p) => p.status === "Active");
  const maturedPlans = mockSavingsPlans.filter((p) => p.status === "Matured");

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
        <Button asChild>
          <Link href="dashboard/savings/new" className="mt-4 sm:mt-0">
            <Plus className="h-5 w-5" />
            <span>New Plan</span>
          </Link>
        </Button>
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
};

export default async function SavingsPage() {
  await pageAuthGuard("/dashboard/savings");
  return <SavingsPlansPage />;
}
