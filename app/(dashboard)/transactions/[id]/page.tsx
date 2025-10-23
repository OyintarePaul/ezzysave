import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Calendar,
  User,
  Pin,
} from "lucide-react";
import { DetailRowProps, StatusConfig, Transaction } from "@/types";
import { typeColors } from "@/constants";
import Link from "next/link";

const selectedTransaction: Transaction = {
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
};
export default function TransactionDetails() {
  return (
    <>
      <Button className="px-0 mb-8 text-base" asChild>
        <Link href="/dashboard/transactions">
          <ArrowLeft size={20} className="mr-2" />
          Back to Transactions
        </Link>
      </Button>

      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const config = getStatusConfig(selectedTransaction.status);
                  const StatusIcon = config.icon;
                  return (
                    <StatusIcon className={`size-8 ${config.iconColor}`} />
                  );
                })()}
                <CardTitle className="text-2xl font-bold dark:text-gray-50">
                  {selectedTransaction.description}
                </CardTitle>
              </div>
              <CardDescription className="dark:text-gray-400">
                Transaction ID: {selectedTransaction.id}
              </CardDescription>
            </div>
            <div className="text-right">
              <p
                className={`text-4xl font-bold ${
                  typeColors[selectedTransaction.type]
                } mb-2`}
              >
                {selectedTransaction.amount}
              </p>
              <Badge
                variant="outline"
                className={`text-sm py-1 px-3 ${
                  getStatusConfig(selectedTransaction.status).iconColor
                } dark:border-gray-700`}
              >
                {getStatusConfig(selectedTransaction.status).label}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Separator className="dark:bg-gray-800" />

        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 mb-8">
            {/* Transaction Details Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-gray-100">
                <CreditCard className="size-5 text-gray-600 dark:text-gray-400" />
                Transaction Details
              </h2>
              <div className="space-y-1">
                {/* Using DetailRow */}
                <DetailRow
                  label="From"
                  value={selectedTransaction.from}
                  className="border-b dark:border-gray-800"
                />
                <DetailRow
                  label="To"
                  value={selectedTransaction.to}
                  className="border-b dark:border-gray-800"
                />
                <DetailRow
                  label="Reference"
                  value={selectedTransaction.reference}
                  className="border-b dark:border-gray-800"
                />
                <DetailRow
                  label="Amount"
                  value={selectedTransaction.amount}
                  className={`${typeColors[selectedTransaction.type]}`}
                />
              </div>
            </div>

            {/* Date & Context Details Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-gray-100">
                <Calendar className="size-5 text-gray-600 dark:text-gray-400" />
                Date & Context
              </h2>
              <div className="space-y-1">
                {/* Using DetailRow */}
                <DetailRow
                  label="Date"
                  value={selectedTransaction.date}
                  className="border-b dark:border-gray-800"
                />
                <DetailRow
                  label="Time"
                  value={selectedTransaction.time}
                  className="border-b dark:border-gray-800"
                />
                <DetailRow
                  label="Method"
                  value={selectedTransaction.details.method}
                  className="border-b dark:border-gray-800"
                />
                <DetailRow
                  label="Category"
                  value={selectedTransaction.details.category}
                />
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <Card className="mb-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-50">
                <User className="size-5 text-gray-600 dark:text-gray-400" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Bank
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTransaction.details.bank}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Account Number
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTransaction.details.account}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message for Failed Transactions */}
          {selectedTransaction.status === "failed" &&
            selectedTransaction.details.reason && (
              <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 mb-8">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  <strong>Reason:</strong> {selectedTransaction.details.reason}
                </p>
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 md:flex-none" size="lg">
              <Download size={20} className="mr-2" />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              className="flex-1 md:flex-none dark:hover:bg-gray-700 dark:text-gray-50"
              size="lg"
            >
              <Pin size={20} className="mr-2" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
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
