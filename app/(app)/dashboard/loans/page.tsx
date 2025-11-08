import { Card } from "@/components/ui/card";
import { Loan, mockLoans } from "@/constants/mock";
import { pageAuthGuard } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import {
  Banknote,
  CheckCircle,
  CircleCheck,
  ClipboardList,
  Clock,
  HandCoins,
  Percent,
} from "lucide-react";
import LoanApplicationModal from "./loan-application-modal";
import { Button } from "@/components/ui/button";

// Loan History Item Component
const LoanHistoryItem: React.FC<{ loan: Loan }> = ({ loan }) => {
  const paidAmount = loan.originalAmount - loan.balance;
  const progress = (paidAmount / loan.originalAmount) * 100;

  let statusClass = "";
  let barColor = "";
  let icon;

  switch (loan.status) {
    case "Active":
      statusClass = "bg-primary/20 text-primary";
      barColor = "bg-primary";
      icon = <Banknote className="w-5 h-5 text-primary" />;
      break;
    case "Paid Off":
      statusClass = "bg-green-200 text-green-900";
      barColor = "bg-green-600";
      icon = <CheckCircle className="w-5 h-5 text-green-600" />;
      break;
    case "Deferred":
      statusClass = "bg-yellow-200 text-yellow-900";
      barColor = "bg-yellow-600";
      icon = <Clock className="w-5 h-5 text-yellow-600" />;
      break;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {loan.name}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${statusClass}`}
        >
          {loan.status}
        </span>
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Rate: {loan.rate.toFixed(1)}%</span>
        <span>Type: {loan.type}</span>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Balance: {formatCurrency(loan.balance)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-600">
          <div
            className={`h-2.5 rounded-full ${barColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatCurrency(paidAmount)} Paid</span>
          <span>{progress.toFixed(0)}% Complete</span>
        </div>
      </div>

      {(loan.status === "Active" || loan.status === "Deferred") && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button className="w-full sm:w-auto px-5 py-2 font-semibold h-auto">
            Make Payment
          </Button>
        </div>
      )}
    </div>
  );
};

const LoanApplicationSection = () => (
  <section
    className="lg:col-span-2 p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    id="loan-application-section"
  >
    <h2 className="text-2xl font-bold text-primary mb-6 flex items-center space-x-4">
      <ClipboardList />
      <span>Need a loan?</span>
    </h2>

    <p className="text-gray-600 text-lg mb-8">
      Skip the estimations and begin your official application right now. Our
      process is fast, secure, and provides a decision in minutes.
    </p>

    <div className="space-y-4 mb-10 p-4 bg-primary/10 rounded-lg">
      <div className="flex items-center space-x-3 text-primary">
        <CircleCheck className="size-5" />
        <span className="font-medium">Quick Pre-Approval</span>
      </div>
      <div className="flex items-center space-x-3 text-primary">
        <Percent className="size-5" />
        <span className="font-medium">Competitive Rates</span>
      </div>
    </div>

    {/* Apply Button */}
    <LoanApplicationModal />
  </section>
);

const Loans: React.FC = () => {
  const activeLoans = mockLoans.filter(
    (l) => l.status === "Active" || l.status === "Deferred"
  );
  const paidLoans = mockLoans.filter((l) => l.status === "Paid Off");

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-16 lg:pb-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          EzzySave Loan Center
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your outstanding credit and apply for new loans.
        </p>
      </header>

      <main className="space-y-8">
        <LoanApplicationSection />

        {/* Current Loans Status (1/3 width on desktop) */}
        <section className="lg:col-span-1 mt-8">
          <Card className="p-6 h-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <HandCoins className="h-5 w-5 mr-2 text-red-500" />
              My Active Obligations ({activeLoans.length})
            </h2>

            <div className="space-y-4">
              {activeLoans.length > 0 ? (
                activeLoans.map((loan) => (
                  <LoanHistoryItem key={loan.id} loan={loan} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No active loans found. Time to take one out!
                </p>
              )}
            </div>
          </Card>
        </section>

        {/* Paid Off History (Full width, optional) */}
        {paidLoans.length > 0 && (
          <section className="lg:col-span-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Paid Off History ({paidLoans.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {paidLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-3 bg-green-50 dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300"
                >
                  <CheckCircle className="w-5 h-5 mb-1" />
                  <p className="font-semibold">{loan.name}</p>
                  <p className="text-xs">
                    Original: {formatCurrency(loan.originalAmount)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default async function LoansPage() {
  pageAuthGuard("/loans");
  return <Loans />;
}
