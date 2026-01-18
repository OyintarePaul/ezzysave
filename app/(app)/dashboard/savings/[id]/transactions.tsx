import { getTransactions } from "@/lib/payload";
import { formatDate } from "@/lib/utils";
import { Transaction } from "@/payload-types";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";

export default async function PlanTransactions({
  customerId,
  planId,
}: {
  customerId: string;
  planId: string;
}) {
  const transactions = await getTransactions(customerId, planId);

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
                  {formatDate(new Date(tx.createdAt))}
                </p>
              </div>
            </div>
            <p className={getTransactionAmountClass(tx.type)}>
              {tx.amount > 0 ? `+` : `-`}${Math.abs(tx.amount).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">
          No transactions recorded for this plan yet.
        </p>
      )}
    </div>
  );
}
