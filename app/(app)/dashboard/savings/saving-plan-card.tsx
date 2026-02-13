import { SavingsPlan } from "@/payload-types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Lock, Target, Zap } from "lucide-react";
import Link from "next/link";

export const SavingsPlanCard = ({ plan }: { plan: SavingsPlan }) => {
  const getIconAndColor = (type: SavingsPlan["planType"]) => {
    switch (type) {
      case "Target":
        return {
          icon: <Target className="h-6 w-6 text-green-500" />,
          color: "text-green-500",
          barColor: "bg-green-500",
          bgColor: "bg-green-100",
        };
      case "Fixed":
        return {
          icon: <Lock className="h-6 w-6 text-blue-500" />,
          color: "text-blue-500",
          barColor: "bg-blue-500",
          bgColor: "bg-blue-100",
        };
      case "Daily":
        return {
          icon: <Zap className="h-6 w-6 text-yellow-500" />,
          color: "text-yellow-500",
          barColor: "bg-yellow-500",
          bgColor: "bg-yellow-100",
        };
    }
  };

  const { icon, color, barColor, bgColor } = getIconAndColor(plan.planType);
  const progress = (plan.currentBalance! / plan.targetAmount!) * 100;
  const isFixed = plan.planType === "Fixed";
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {plan.planName}
            </h3>
          </div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${color} ${
              plan.status === "Active"
                ? `bg-opacity-20 ${bgColor}`
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            {plan.planType}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
          {plan.planType} Savings Plan
        </p>

        {/* Progress Bar or Fixed amount display */}
        {isFixed ? (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(plan.currentBalance!)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Locked for {plan.duration} months @ {plan.interestRate}% APY
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(plan.currentBalance!)} Saved
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Goal: {formatCurrency(plan.targetAmount!)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${barColor}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
              {progress ? progress.toFixed(1): 0}% Complete
            </p>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button size="sm" variant="link" asChild>
          <Link href={`/dashboard/savings/${plan.id}`}>View Details →</Link>
        </Button>
      </div>
    </div>
  );
};
