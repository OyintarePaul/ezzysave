import { getTransactions } from "@/data/transactions/getTransactions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/payload-types";
import { ArrowDown, ArrowDownLeft, ArrowUp, ArrowUpRight, CircleCheck, TrendingUp } from "lucide-react";

export default async function PlanTransactions({ planId }: { planId: string }) {
  const transactions = await getTransactions(planId);

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
    <div className="space-y-3">
      {transactions.length > 0 ? (
        transactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))
      ) : (
        <p className="text-gray-500 italic">
          No transactions recorded for this plan yet.
        </p>
      )}
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

  const formattedAmount = formatCurrency(Math.abs(transaction.amount));
  const DirectionIcon = isCredit ? ArrowDownLeft : ArrowUpRight; // Influx/Outflux relative to the user's account

  return (
    <li className="flex justify-between items-center py-4 border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-100 px-1">
      {/* Icon & Main Details (Left side) */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-grow min-w-0">
        <div
          className={`p-2 rounded-lg flex-shrink-0 ${iconBg} hidden sm:block`}
        >
          <DirectionIcon className="h-5 w-5" />
        </div>
        <div>
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
          {transaction.status === "pending" ? "Pending" : "Complete"}
        </p>
      </div>
    </li>
  );
};
