import CustomButton from "@/components/custom-button";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Loan } from "@/payload-types";
import { CheckCheck, CheckCircle2, XCircle } from "lucide-react";
import ApprovedActions from "./ApprovedActions";

export default function ApprovedLoan({ loan }: { loan: Loan }) {
  const amountWithInterest = (loan.amount * (100 + loan.interestRate!)) / 100;
  return (
    <section className="lg:col-span-2 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
          <CheckCheck className="w-6 h-6 mr-2" />
          Great News
        </h2>

        <p className="text-gray-600 text-lg mb-8">
          Your loan application for {formatCurrency(loan.amount)} has been
          approved. Review the details below to proceed.
        </p>

        <Alert className="bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800 text-primary p-6 mb-10">
          <CheckCircle2 className="w-8 h-8 shrink-0 text-primary" />
          <div>
            <h4 className="text-primary  font-black text-lg">
              Offer Ready for Acceptance
            </h4>
            <p className="text-primarytext-sm mt-1">
              Interest rate:{" "}
              <span className="font-bold">{loan.interestRate}</span> | Duration:{" "}
              <span className="font-bold">{loan.duration} months</span>
            </p>
          </div>
        </Alert>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Estimated Interest
              </p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                {formatCurrency((loan.amount * (loan.interestRate || 0)) / 100)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Total Payback
              </p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                {formatCurrency(amountWithInterest)}
              </p>
            </CardContent>
          </Card>
        </div>
        <ApprovedActions loanId={loan.id} />
      </div>
    </section>
  );
}
