import { pageAuthGuard } from "@/lib/auth";
import { DollarSign } from "lucide-react";

const Overview: React.FC = () => {
  return (
    // Added pb-20 padding to push content up above the fixed bottom navigation on mobile
    <div className="p-4 sm:p-8 space-y-8 pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome back! Here's a summary of your financial progress.
      </p>

      {/* Overview Cards Grid: Responsive adjustments (2 columns on small, 4 on large) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <OverviewCard
          title="Total Funds Saved"
          value="$12,450.00"
          description="+5.2% from last month"
          bgColor="bg-green-500"
        />
        <OverviewCard
          title="Target Savings Goal"
          value="$5,000.00"
          description="2 active goals, 65% complete"
          bgColor="bg-blue-500"
        />
        <OverviewCard
          title="Accrued Interest"
          value="$156.75"
          description="Interest earned this quarter"
          bgColor="bg-yellow-500"
        />
        <OverviewCard
          title="Available for Loan"
          value="$8,000.00"
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
        <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <button className="w-full text-left p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition">
            + Create New Savings Plan
          </button>
          <button className="w-full text-left p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition dark:bg-red-900/30 dark:hover:bg-red-900/50">
            Request a Quick Loan
          </button>
          <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition dark:bg-gray-700/30 dark:hover:bg-gray-700/50">
            View Transaction History
          </button>
        </div>
      </div>
    </div>
  );
};

interface OverviewCardProps {
  title: string;
  value: string;
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
      {value}
    </h3>
    <p className="text-xs text-gray-600 mt-2 dark:text-gray-400">
      {description}
    </p>
  </div>
);

export default async function OverviewPage() {
  pageAuthGuard("/overview");
  return <Overview />;
}
