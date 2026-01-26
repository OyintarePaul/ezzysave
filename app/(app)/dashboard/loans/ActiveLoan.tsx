import CustomButton from "@/components/custom-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, loanAmountWithInterest } from "@/lib/utils";
import { Loan } from "@/payload-types";
import { addMonths } from "date-fns";
import {
  Banknote,
  Calendar,
  Clock,
  Percent,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import MakePayment from "./make-payment";

export default function ActiveLoan({ loan }: { loan: Loan }) {
  const startDate = new Date(loan.createdAt);
  const amountWithInterest = loanAmountWithInterest(
    loan.amount,
    loan.interestRate!,
  );

  const balance = amountWithInterest - (loan.amountPaid || 0);
  const maturityDate = addMonths(startDate, loan.duration);
  return (
    <div className="space-y-6">
      {/* Primary Payment Card */}
      <Card className="flex flex-col justify-between">
        <CardContent>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
              Remaining Balance
            </p>
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">
              {formatCurrency(balance)}
            </h3>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Due Date
                </p>
                <p className="text-lg font-black text-primary">
                  {maturityDate.toDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Data Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Principal",
            value: formatCurrency(loan.amount),
            icon: <ReceiptText size={14} />,
          },
          {
            label: "Amount Paid",
            value: formatCurrency(loan.amountPaid || 0),
            icon: <Percent size={14} />,
          },
          {
            label: "Interest rate",
            value: loan.interestRate,
            icon: <Percent size={14} />,
          },
          {
            label: "Duration in months",
            value: loan.duration,
            icon: <Clock size={14} />,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm"
          >
            <div className="flex items-center space-x-2 text-primary mb-1.5">
              {item.icon}
              <span className="text-[9px] font-black uppercase tracking-widest">
                {item.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <MakePayment loan={loan} />
    </div>
  );
}
