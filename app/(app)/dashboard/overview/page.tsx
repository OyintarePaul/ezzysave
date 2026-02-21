import { getDashboardStats } from "@/data/dashboard/getStats";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import PageLayout from "../components/page-layout";
import { Metadata } from "next";
import QuickLinks from "./quick-links";
import { getCurrentPayloadCustomer } from "@/data/customers/getCustomer";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  const { id } = await getCurrentPayloadCustomer();
  const {
    totalSaved,
    totalTarget,
    activePlans,
    accruedInterest,
    approvedLoan,
  } = await getDashboardStats(id);
  return (
    <PageLayout
      title="Dashboard Overview"
      subtitle="Welcome back! Here's a summary of your financial progress."
    >
      {/* Overview Cards Grid: Responsive adjustments (2 columns on small, 4 on large) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
        <OverviewCard
          title="Total Funds Saved"
          value={totalSaved}
          description="+5.2% from last month"
          bgColor="bg-green-500"
        />
        <OverviewCard
          title="Target Savings Goal"
          value={totalTarget}
          description={`${activePlans} active goals, ${((totalSaved / totalTarget) * 100).toFixed(1)}% complete`}
          bgColor="bg-blue-500"
        />
        <OverviewCard
          title="Accrued Interest"
          value={+accruedInterest.toFixed(1)}
          description="Interest earned this month"
          bgColor="bg-yellow-500"
        />
        <OverviewCard
          title="Available for Loan"
          value={approvedLoan}
          description="Pre-approved loan limit"
          bgColor="bg-red-500"
        />
      </div>

      {/* Current Plans and Quick Actions: Responsive stack on mobile, side-by-side on large */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
        {/* Section 1: Active Plans */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
            Active Savings Plans
          </h2>

          {/* Mock list of plans */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 border-b dark:border-gray-700">
              <div>
                <p className="font-medium text-blue-600">Vacation Fund</p>
                <p className="text-sm text-gray-500">
                  Target Savings | $3,200 / $5,000
                </p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 sm:mt-0">
                View Progress
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 border-b dark:border-gray-700">
              <div>
                <p className="font-medium text-green-600">Emergency Lockbox</p>
                <p className="text-sm text-gray-500">
                  Fixed Savings | $5,000 Locked
                </p>
              </div>
              <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                Matures in 6 mo
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3">
              <div>
                <p className="font-medium text-yellow-600">
                  Daily Coffee Budget
                </p>
                <p className="text-sm text-gray-500">
                  Daily Savings | $150 remaining
                </p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 sm:mt-0">
                Deposit Now
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <QuickLinks />
      </div>
    </PageLayout>
  );
}

interface OverviewCardProps {
  title: string;
  value: number;
  description: string;
  bgColor: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  description,
  bgColor,
}) => (
  <div className="p-6 rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div className={`p-2 w-fit rounded-lg mb-4 text-white ${bgColor}`}>
      <DollarSign className="h-6 w-6" />
    </div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {title}
    </p>
    <h3 className="text-lg md:text-3xl font-extrabold text-gray-900 mt-1 dark:text-white">
      {formatCurrency(value)}
    </h3>
    <p className="text-xs text-gray-600 mt-2 dark:text-gray-400">
      {description}
    </p>
  </div>
);
