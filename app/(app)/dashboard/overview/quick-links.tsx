import CustomButton from "@/components/custom-button";
import Link from "next/link";
export default function QuickLinks() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Quick Actions
      </h2>
      <CustomButton
        className="w-full text-left p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition"
        asChild
      >
        <Link href="/dashboard/savings/new">+ Create New Savings Plan</Link>
      </CustomButton>
      <CustomButton
        className="w-full text-left p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition dark:bg-red-900/30 dark:hover:bg-red-900/50"
        asChild
      >
        <Link href="/dashboard/loans">Request a Quick Loan</Link>
      </CustomButton>
      <CustomButton
        className="w-full text-left py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition dark:bg-gray-700/30 dark:hover:bg-gray-700/50"
        asChild
      >
        <Link href="/dashboard/transactions">View Transaction History</Link>
      </CustomButton>
    </div>
  );
}
