import { Button } from "@/components/ui/button";
import { mockSavingsPlans, SavingsPlan, Transaction } from "@/constants/mock";
import { pageAuthGuard } from "@/lib/auth";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  Lock,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

const SavingsDetailPage: React.FC<{ planID: string }> = () => {
  // For now, hardcode to display the first active plan's details
  const plan: SavingsPlan = mockSavingsPlans[0];
  const progress = (plan.currentAmount / plan.targetAmount) * 100;
  const isFixed = plan.type === "Fixed";

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
  const { icon, barColor } = getIconAndColor(plan.type);

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "Deposit":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "Withdrawal":
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      case "Interest":
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTransactionAmountClass = (type: Transaction["type"]) => {
    switch (type) {
      case "Deposit":
        return "text-green-600 font-semibold";
      case "Withdrawal":
        return "text-red-600 font-semibold";
      case "Interest":
        return "text-yellow-600 font-semibold";
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 pb-20 lg:pb-8">
      <header className="flex items-center space-x-4 mb-6">
        <Button size="icon" variant="secondary" className="rounded-full" asChild>
          <Link href="/savings">
          <ChevronLeft />
          </Link>
        </Button>
        <div className="flex items-center space-x-3">
          <span className="hidden md:inline">{icon}</span>
          <h1 className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white">
            {plan.name}
          </h1>
          <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full ">
            {plan.type} Plan
          </span>
        </div>
      </header>
      <p className="text-gray-600 dark:text-gray-400">
        Detailed view of your savings progress and transaction history.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Progress & Actions (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
              Current Progress
            </h2>

            <div className="flex justify-between items-center mb-2">
              <p className="text-3xl md:text-4xl font-extrabold text-primary">
                ${plan.currentAmount.toLocaleString()}
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Goal: ${plan.targetAmount.toLocaleString()}
              </p>
            </div>

            {!isFixed && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 mb-2">
                  <div
                    className={`h-3 rounded-full ${barColor}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{progress.toFixed(1)}% Complete</span>
                  <span>
                    ${(plan.targetAmount - plan.currentAmount).toLocaleString()}{" "}
                    remaining
                  </span>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Interest Rate (APY)
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.interestRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Projected Maturity
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  May 2026
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
              Transaction History
            </h2>
            <div className="space-y-3">
              {plan.transactions?.length ? (
                plan.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tx.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {tx.date}
                        </p>
                      </div>
                    </div>
                    <p className={getTransactionAmountClass(tx.type)}>
                      {tx.amount > 0 ? `+` : `-`}$
                      {Math.abs(tx.amount).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No transactions recorded for this plan yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Quick Actions (Col 3) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700 space-y-4 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>

            <button className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition shadow-md flex items-center justify-center space-x-2">
              <ArrowUp className="h-5 w-5" />
              <span>Make a Deposit</span>
            </button>

            <button className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition shadow-md flex items-center justify-center space-x-2">
              <ArrowDown className="h-5 w-5" />
              <span>Make a Withdrawal</span>
            </button>

            <div className="pt-4 border-t dark:border-gray-700 space-y-3">
              <button className="w-full py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                Edit Plan Settings
              </button>
              <button className="w-full py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                Close/Mature Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default async function SavingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await pageAuthGuard("/savings");
  return <SavingsDetailPage planID={id} />;
}
