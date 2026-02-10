"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { FormInput } from "../../../../components/form-input";
import { ArrowDown, DollarSign, Info } from "lucide-react";
import CustomButton from "@/components/custom-button";
import { toast } from "sonner";
import { withdrawFromPlan } from "@/server-actions/savings-plans";

export default function WithdrawalModal({ planId }: { planId: string }) {
  const [withdrawalData, setWithdrawalData] = useState({
    amount: 0,
  });
  const [isPending, startTransition] = useTransition();

  const FEE_PERCENTAGE = 0.02; // 2%
  const amount = withdrawalData.amount;
  const serviceFee = amount * FEE_PERCENTAGE;
  const netAmount = amount - serviceFee;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    let val: string | number = value;

    // Use the number conversion logic you asked about
    if (type === "number" || name === "amount") {
      val = value === "" ? 0 : parseFloat(value);
      if (isNaN(val)) val = 0;
    }

    setWithdrawalData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting withdrawal:", withdrawalData);
    // Simulate API call
    startTransition(async () => {
      const response = await withdrawFromPlan(planId, withdrawalData.amount);
      if (!response.success) {
        toast.error(response.error || "Unable to initiate withdrawal.");
        return;
      }
      toast.success(
        "Withdrawal initiated successfully. You will be credited shortly.",
      );
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600">
          <ArrowDown className="h-5 w-5" />
          <span>Make a Withdrawal</span>
        </CustomButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">
            Withdraw from your plan
          </DialogTitle>
          <DialogDescription className="mt-2 mb-6 text-gray-600 dark:text-gray-400">
            Enter the amount you wish to withdraw from your savings plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="amount"
            label="Amount ($)"
            type="number"
            value={withdrawalData.amount}
            onChange={handleChange}
            placeholder="e.g., 5000"
            icon={<DollarSign className="h-5 w-5" />}
          />

          {amount > 0 && (
            <div className="p-5 bg-primary/10 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-primary font-bold">
                  Processing Fee (2%)
                </span>
                <span className="text-destructive font-black">
                  -{serviceFee}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-indigo-200/50 dark:border-indigo-800/50">
                <span className="text-primary font-black">
                  You will receive
                </span>
                <span className="text-xl font-black text-primary">
                  ₦{netAmount}
                </span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Info size={14} className="text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-primary font-bold leading-tight">
                  Standard processing fee applies to all external withdrawals to
                  maintain network stability.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 font-semibold h-auto"
            >
              {isPending ? "Processing..." : "Make withdrawal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
