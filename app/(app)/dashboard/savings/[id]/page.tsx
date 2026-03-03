import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Calendar, Info } from "lucide-react";
import { Lock, Target, Zap } from "lucide-react";
import { SavingsPlan } from "@/payload-types";
import DepositModal from "../deposit-modal";
import { formatCurrency } from "@/lib/utils";
import PlanTransactions from "./transactions";
import DailyContributionTracker from "./DailyContributionTracker";
import WithdrawalModal from "../withdrawal-modal";
import { getPlan } from "@/data/plans/getPlan";
import CustomButton from "@/components/custom-button";
import { Metadata } from "next";
import PageLayout from "../../components/page-layout";
import { getSavingsSettings } from "@/data/plans/getSavingsSettings";
import { addMonths } from "date-fns";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const plan = await getPlan(id);
  return {
    title: plan.planName,
  };
}

export default async function SavingsDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getPlan(id);
  const savingsSettings = await getSavingsSettings(); // Fetch settings for interest rates, fees, etc.
  const isDaily = plan.planType === "Daily";
  const progress = (plan.currentBalance! / plan.targetAmount!) * 100;
  const isFixed = plan.planType === "Fixed";
  const maturityDate = addMonths(
    new Date(plan.createdAt),
    plan.duration || 6,
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const { icon, barColor } = getIconAndColor(plan.planType);

  return (
    <PageLayout
      title={
        <div className="flex items-center space-x-3">
          <span className="hidden md:inline">{icon}</span>
          <span>{plan.planName}</span>
          <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full ">
            {plan.planType} Plan
          </span>
        </div>
      }
      subtitle="Detailed view of your savings progress and transaction history."
      backHref="/dashboard/savings"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Progress & Actions (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                {isDaily
                  ? "Savings Performance"
                  : isFixed
                    ? "Vault Overview"
                    : "Current Progress"}
                {isDaily && <TrendingUp className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {isFixed ? "Locked Balance" : "Current Balance"}
                  </p>
                  <p className="text-4xl md:text-5xl font-black tracking-tight text-primary">
                    {formatCurrency(plan.currentBalance!)}
                  </p>
                </div>

                {/* Hide "Goal" for Daily plans, show for Target/Fixed */}
                {!isDaily && (
                  <div className="text-left md:text-right">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Target Goal
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {formatCurrency(plan.targetAmount!)}
                    </p>
                  </div>
                )}
              </div>

              {/* DESIGN FOR TARGET & DAILY (Progress or Momentum) */}
              {!isFixed && (
                <div className="space-y-3 mb-6">
                  {isDaily ? (
                    // Daily Momentum UI (Since there's no target)
                    <div className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-lg p-4 flex items-center gap-3">
                      <Info className="h-5 w-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-500">
                        You're saving daily. Keep the streak alive to maximize
                        your interest!
                      </p>
                    </div>
                  ) : (
                    // Target Progress UI
                    <>
                      <Progress
                        value={progress}
                        className={`h-3 ${barColor}`}
                      />
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-primary">
                          {progress.toFixed(1)}% Complete
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(
                            plan.targetAmount! - plan.currentBalance!,
                          )}{" "}
                          remaining
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bottom Stats Grid */}
              <Separator className="my-6" />

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-sm flex items-center gap-2 text-muted-foreground">
                    Interest Rate (APY)
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {plan.interestRate!.toFixed(1)}%
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {isFixed ? "Unlocks On" : "Projected Maturity"}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {maturityDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Tracker */}
          {isDaily ? <DailyContributionTracker plan={plan} /> : null}

          {/* Transaction History */}
          <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
              Transaction History
            </h2>
            <PlanTransactions planId={plan.id} />
          </div>
        </div>

        {/* Section 2: Quick Actions (Col 3) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700 space-y-4 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>

            <DepositModal plan={plan} />
            <WithdrawalModal plan={plan} savingsSettings={savingsSettings} />

            <div className="pt-4 border-t dark:border-gray-700 space-y-3">
              <CustomButton variant="outline" className="w-full">
                Edit Plan Settings
              </CustomButton>
              <CustomButton
                variant="outline"
                className="w-full text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                Close/Mature Plan
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

const getIconAndColor = (type: SavingsPlan["planType"]) => {
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
