"use client";
import { CheckCircle, Clock, AlertCircle, LucideIcon } from "lucide-react";

// --- SHADCN Component Imports (Assumed path) ---
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// --- 1. Define Typescript Interfaces ---

/** Defines the structure for transaction details. */
interface TransactionDetails {
  method: string;
  bank: string;
  account: string;
  category: string;
  reason?: string; // Optional for failed transactions
}

/** Defines the main structure for a single transaction object. */
interface Transaction {
  id: string;
  type: "deposit" | "transfer" | "withdrawal" | "pending" | "failed";
  amount: string;
  description: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  from: string;
  to: string;
  reference: string;
  details: TransactionDetails;
}

/** Defines the structure for status configuration. */
interface StatusConfig {
  color: string;
  icon: LucideIcon;
  label: string;
  iconColor: string;
}

// --- Utility Component for Detail Rows (Typed) ---

interface DetailRowProps {
  label: string;
  value: string;
  className?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  className = "",
}) => (
  <div className={`flex justify-between items-center ${className}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

export default function TransactionsReceipt() {
  const transactions: Transaction[] = [
    {
      id: "TXN001",
      type: "deposit",
      amount: "$500.00",
      description: "Monthly Salary Deposit",
      date: "Oct 18, 2025", // Updated year for current time context
      time: "09:30 AM",
      status: "completed",
      from: "ACME Corporation",
      to: "Savings Account",
      reference: "SAL-OCT-2025",
      details: {
        method: "Direct Deposit",
        bank: "First National Bank",
        account: "****1234",
        category: "Income",
      },
    },
    {
      id: "TXN002",
      type: "transfer",
      amount: "$200.00",
      description: "Transfer to Emergency Fund",
      date: "Oct 17, 2025",
      time: "02:15 PM",
      status: "completed",
      from: "Checking Account",
      to: "Emergency Fund",
      reference: "TRF-20251017",
      details: {
        method: "Internal Transfer",
        bank: "First National Bank",
        account: "****5678",
        category: "Transfer",
      },
    },
    {
      id: "TXN003",
      type: "withdrawal",
      amount: "$75.50",
      description: "ATM Withdrawal",
      date: "Oct 16, 2025",
      time: "11:45 AM",
      status: "completed",
      from: "Savings Account",
      to: "Cash",
      reference: "ATM-20251016",
      details: {
        method: "ATM",
        bank: "First National Bank - Main Branch",
        account: "****1234",
        category: "Cash Withdrawal",
      },
    },
    {
      id: "TXN004",
      type: "pending",
      amount: "$150.00",
      description: "Online Purchase - Electronics",
      date: "Oct 15, 2025",
      time: "06:20 PM",
      status: "pending",
      from: "Credit Card",
      to: "Tech Store Online",
      reference: "ORD-20251015",
      details: {
        method: "Credit Card",
        bank: "Premium Credit Card",
        account: "****9012",
        category: "Shopping",
      },
    },
    {
      id: "TXN005",
      type: "failed",
      amount: "$300.00",
      description: "Transfer Failed",
      date: "Oct 14, 2025",
      time: "03:30 PM",
      status: "failed",
      from: "Checking Account",
      to: "External Account",
      reference: "TRF-20251014",
      details: {
        method: "Wire Transfer",
        bank: "First National Bank",
        account: "****1234",
        category: "Transfer",
        reason: "Insufficient funds",
      },
    },
  ];

  // --- 3. Use the defined StatusConfig type for the helper function ---
  const getStatusConfig = (status: Transaction["status"]): StatusConfig => {
    switch (status) {
      case "completed":
        return {
          color:
            "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400",
          icon: CheckCircle,
          label: "Completed",
          iconColor: "text-green-600 dark:text-green-400",
        };
      case "pending":
        return {
          color:
            "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400",
          icon: Clock,
          label: "Pending",
          iconColor: "text-yellow-600 dark:text-yellow-400",
        };
      case "failed":
        return {
          color:
            "bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400",
          icon: AlertCircle,
          label: "Failed",
          iconColor: "text-red-600 dark:text-red-400",
        };
    }
  };

  // --- 4. Type the object keys to match Transaction['type'] ---
  const typeColors: Record<Transaction["type"], string> = {
    deposit: "text-green-600 dark:text-green-400",
    transfer: "text-blue-600 dark:text-blue-400",
    withdrawal: "text-orange-600 dark:text-orange-400",
    pending: "text-yellow-600 dark:text-yellow-400",
    failed: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="mt-8">
      {/* Transaction list */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transactions</h1>
        <p className="text-muted-foreground">
          View and download your transaction details
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.map((txn) => {
          const config = getStatusConfig(txn.status);
          const StatusIcon = config.icon;

          return (
            <Link href={`/dashboard/transactions/${txn.id}`} key={txn.id}>
              <Card
                className={`transition-colors border-gray-200 dark:border-gray-800 ${config.color}`}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-full ${config.iconColor} bg-white dark:bg-gray-900 shadow-sm`}
                    >
                      <StatusIcon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {txn.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {txn.date} at {txn.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${typeColors[txn.type]}`}>
                      {txn.amount}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
