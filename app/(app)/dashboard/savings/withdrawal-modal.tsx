"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTransition } from "react";
import { FormInput } from "../../../../components/form-input";
import { ArrowDown, DollarSign, Info } from "lucide-react";
import CustomButton from "@/components/custom-button";
import { toast } from "sonner";
import { withdrawFromPlan } from "@/server-actions/savings-plans";
import { SavingsPlan } from "@/payload-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WithdrawalFormData,
  withdrawalFormSchema,
} from "@/lib/schema/withdrawal-form";

export default function WithdrawalModal({ plan }: { plan: SavingsPlan }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      amount: 0,
      planId: plan.id,
    },
  });

  const amount = watch("amount");
  const [isPending, startTransition] = useTransition();
  const FEE_PERCENTAGE = 0.02; // 2%

  const serviceFee = amount * FEE_PERCENTAGE;
  const netAmount = amount - serviceFee;
  const isFixed = plan.planType === "Fixed";
  const isMatured = plan.status === "Matured";

  const onSubmit = (values: WithdrawalFormData) => {
    startTransition(async () => {
      const response = await withdrawFromPlan(values);
      if (!response.success) {
        toast.error(response.message || "Unable to initiate withdrawal.");
        return;
      }
      toast.success(response.message);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton
          className="w-full bg-destructive text-white hover:bg-red-600"
          disabled={isFixed && !isMatured}
        >
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput {...register("planId")} id="planId" hidden readOnly />
          <FormInput
            {...register("amount", { valueAsNumber: true })}
            id="amount"
            label="Amount ($)"
            type="number"
            placeholder="e.g., 5000"
            icon={<DollarSign className="h-5 w-5" />}
            error={errors.amount?.message}
          />

          {amount >= 100 && (
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
            <DialogClose asChild>
              <CustomButton type="button" variant="secondary">
                Cancel
              </CustomButton>
            </DialogClose>
            <CustomButton type="submit" isPending={isPending}>
              Make Withdrawal
            </CustomButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
