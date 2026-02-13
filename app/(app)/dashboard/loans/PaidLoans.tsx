import { formatCurrency } from "@/lib/utils";
import { Loan } from "@/payload-types";
import { CircleCheck } from "lucide-react";

export default async function PaidLoans({ loans }: { loans: Loan[] }) {
  const paidLoans = loans.filter((l) => l.status === "paidOff");

  return (
    <div>
      {paidLoans.length > 0 && (
        <section className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <CircleCheck className="size-5 mr-2 text-green-600" />
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
