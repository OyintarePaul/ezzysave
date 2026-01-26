"use client";
import CustomButton from "@/components/custom-button";
import { Spinner } from "@/components/ui/spinner";
import { acceptAndDisburseLoan, rejectLoan } from "@/server-actions/loans";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ApprovedActions({ loanId }: { loanId: string }) {
  const [isAcceptPending, startAcceptTransition] = useTransition();
  const [isDeclinePending, startDeclineTransition] = useTransition();

  const handleAccept = async () => {
    startAcceptTransition(async () => {
      const response = await acceptAndDisburseLoan(loanId);
      if (response.success) {
        toast.success("Loan accepted and will be disbursed.");
      } else {
        toast.error(
          response.error || "Failed to accept the loan. Please try again.",
        );
      }
    });
  };

  const handleDecline = async () => {
    startDeclineTransition(async () => {
      const response = await rejectLoan(loanId);
      if (response.success) {
        toast.success("Loan offer declined successfully.");
      } else {
        toast.error(
          response.error ||
            "Failed to decline the loan offer. Please try again.",
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <CustomButton
        className="w-full text-lg py-5"
        onClick={handleAccept}
        disabled={isAcceptPending}
      >
        {isAcceptPending ? <Spinner /> : null}
        <CheckCircle2 className="w-6 h-6 mr-2" /> Accept & Disburse
      </CustomButton>
      <CustomButton
        variant="destructive"
        className="w-full py-4 text-sm font-black border-none"
        onClick={handleDecline}
        disabled={isDeclinePending}
      >
        {isDeclinePending ? <Spinner /> : null}
        <XCircle className="w-5 h-5 mr-2" /> Decline Offer
      </CustomButton>
    </div>
  );
}
