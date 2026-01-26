import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Loan } from "@/payload-types";
import { Banknote, CheckCircle, Clock, HandCoins } from "lucide-react";
import MakePayment from "./make-payment";

export default async function LoansList({ loans }: { loans: Loan[] }) {
  const activeLoans = loans.filter(
    (l) => l.status === "active" || l.status === "deferred"
  );
  const paidLoans = loans.filter((l) => l.status === "paidOff");

  return (
    <div>
      {/* Current Loans Status (1/3 width on desktop) */}
      {/* <section className="lg:col-span-1 mt-8">
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
      </section> */}

      {paidLoans.length > 0 && (
        <section className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Paid Off History ({paidLoans.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paidLoans.map((loan) => (
              <div
                key={loan.id}
                className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-green-200 dark:hover:border-green-800 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 dark:bg-green-900/40 px-2 py-0.5 rounded-md">
                    Complete
                  </span>
                </div>

                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Loan ID: #{loan.id}
                </p>

                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Paid
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(loan.amountPaid || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const LoanHistoryItem: React.FC<{ loan: Loan }> = ({ loan }) => {
  const amountWithInterest = loan.amount * ((100 + loan.interestRate!) / 100)
  const progress = (loan.amountPaid! / amountWithInterest) * 100;
  const balance = (amountWithInterest - loan.amountPaid!)

  let statusClass = "";
  let barColor = "";
  let icon;

  switch (loan.status) {
    case "approved":
      statusClass = "bg-primary/20 text-primary";
      barColor = "bg-primary";
      icon = <Banknote className="w-5 h-5 text-primary" />;
      break;
    case "paidOff":
      statusClass = "bg-green-200 text-green-900";
      barColor = "bg-green-600";
      icon = <CheckCircle className="w-5 h-5 text-green-600" />;
      break;
    case "deferred":
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
            Loan ID: {loan.id}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusClass}`}
        >
          {loan.status}
        </span>
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Rate: {loan.interestRate!.toFixed(1)}%</span>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Balance: {formatCurrency(balance)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-600">
          <div
            className={`h-2.5 rounded-full ${barColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatCurrency(loan.amountPaid!)} Paid</span>
          <span>{progress.toFixed(0)}% Complete</span>
        </div>
      </div>

      {(loan.status === "approved" || loan.status === "deferred") && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <MakePayment loan={loan} />
        </div>
      )}
    </div>
  );
};
