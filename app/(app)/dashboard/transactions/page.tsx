import { buttonVariants } from "@/components/ui/button";
import { getCurrentPayloadCustomer } from "@/data/customers/getCustomer";
import { getTransactions } from "@/data/transactions/getTransactions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/payload-types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CircleCheck,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transaction History",
};

export default async function Transactions({
  searchParams,
}: {
  searchParams: Promise<{ filter: string }>;
}) {
  const params = await searchParams;
  const { id } = await getCurrentPayloadCustomer();
  const transactions = await getTransactions(id, undefined, 100); // Fetch up to 100 transactions for better filtering on the client side
  const activeFilter = params.filter || "All";

  const filterOptions = [
    {
      label: "All",
      icon: <Filter className="h-4 w-4 mr-1" />,
      href: "/dashboard/transactions?filter=All",
    },
    {
      label: "Savings",
      icon: <TrendingUp className="h-4 w-4 mr-1" />,
      href: "/dashboard/transactions?filter=Savings",
    },
    {
      label: "Loans",
      icon: <Banknote className="h-4 w-4 mr-1" />,
      href: "/dashboard/transactions?filter=Loans",
    },
  ];

  // The filteredTransactions array is explicitly typed as Transaction[]
  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === "All") return true;
    return tx.category === activeFilter;
  });

  return (
    // Outer container for layout consistency
    <div className="p-4 sm:p-8 space-y-8 pb-20 lg:pb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Transaction History
      </h1>

      {/* Added Page Description */}
      <p className="text-md text-gray-600 dark:text-gray-400 -mt-4">
        Review all of your recent financial movements. Use the filters below to
        quickly find specific categories.
      </p>

      {/* Filter Bar Card */}
      <div className="bg-white p-4 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filter Transactions
        </h3>
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <Link
              className={buttonVariants({
                variant: activeFilter === option.label ? "default" : "outline",
              })}
              key={option.label}
              href={option.href}
            >
              {option.icon}
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Transaction List Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700 space-y-4">
        <div className="flex justify-between items-center border-b pb-3 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} items
          </p>
        </div>

        {filteredTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {filteredTransactions.map((tx: Transaction) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-primary" />
            <p className="font-medium">
              No transactions found for "{activeFilter}".
            </p>
            <p className="text-sm">
              Try a different filter or check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const isCredit = transaction.type === "Deposit";
  const amountColor = isCredit
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
  const iconBg = isCredit
    ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
    : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400";

  const formattedAmount = formatCurrency(transaction.amount);
  const DirectionIcon = isCredit ? ArrowDownLeft : ArrowUpRight; // Influx/Outflux relative to the user's account

  return (
    <li className="flex justify-between items-center py-4 border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-100 px-1">
      {/* Icon & Main Details (Left side) */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-grow min-w-0">
        <div
          className={`p-2 rounded-lg flex-shrink-0 ${iconBg} hidden sm:block`}
        >
          <DirectionIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-xs md:text-base text-gray-900 dark:text-white truncate">
            {transaction.description}
          </p>
          {/* Compact date and category display */}
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 space-x-1">
            {formatDate(new Date(transaction.createdAt))}
          </p>
        </div>
      </div>

      {/* Amount and Status (Right side, strong emphasis) */}
      <div className="text-right flex-shrink-0 ml-4">
        <p
          className={`font-extrabold text-sm md:text-lg ${amountColor} leading-none`}
        >
          {isCredit ? "+" : "-"} {formattedAmount}
        </p>
        <p
          className={`flex items-center justify-end text-xs font-medium dark:opacity-80 mt-1`}
        >
          <CircleCheck className="h-3 w-3 mr-1" />
          {transaction.status}
        </p>
      </div>
    </li>
  );
};
