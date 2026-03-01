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
import { useState, useTransition } from "react";
import { ArrowDown, DollarSign, Info } from "lucide-react";
import CustomButton from "@/components/custom-button";
import { toast } from "sonner";
import { withdrawFromPlan } from "@/server-actions/savings-plans";
import { SavingsPlan } from "@/payload-types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WithdrawalFormData,
  withdrawalFormSchema,
} from "@/lib/schema/withdrawal-form";
import { FormInput } from "@/components/form-input";
import PinVault from "./pin-vault";
import { formatCurrency } from "@/lib/utils";

export default function WithdrawalModal({ plan }: { plan: SavingsPlan }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors },
    reset,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalFormSchema),
    mode: "onSubmit",
    defaultValues: {
      amount: 0,
      planId: plan.id,
      pin: "",
    },
  });

  const [amount, pin] = watch(["amount", "pin"]);

  const FEE_PERCENTAGE = 0.02;
  const serviceFee = +(amount * FEE_PERCENTAGE).toFixed(2);
  const netAmount = amount - serviceFee;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setStep(1);
        reset();
      }, 300); // Reset after animation
    }
  };

  const onNext = async () => {
    // Trigger validation only for Step 1 fields
    const isStepValid = await trigger(["amount", "planId"]);
    if (isStepValid) {
      setStep(2);
    }
  };
  const goBack = () => {
    setStep(1);
    setValue("pin", "", {
      shouldValidate: false, // Don't trigger validation errors yet
      shouldDirty: false, // Keeps the form "pristine"
    });
  };

  const onSubmit = (values: WithdrawalFormData) => {
    startTransition(async () => {
      const response = await withdrawFromPlan(values);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      handleOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <CustomButton
          className="w-full bg-destructive text-white hover:bg-red-600"
          disabled={plan.planType === "Fixed" && plan.status !== "Matured"}
        >
          <ArrowDown className="h-5 w-5" />
          <span>Make a Withdrawal</span>
        </CustomButton>
      </DialogTrigger>

      <DialogContent
        className={step === 2 ? "sm:max-w-[420px]" : "sm:max-w-[480px]"}
      >
        {step === 1 ? (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Specify the amount you want to withdraw
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onNext)} className="space-y-6">
              <FormInput
                {...register("amount", { valueAsNumber: true })}
                id="amount"
                label="Amount"
                type="number"
                placeholder="0.00"
                icon={<DollarSign className="h-5 w-5" />}
                error={errors.amount?.message}
              />

              {amount >= 100 && (
                <div className="p-4 bg-muted/50 rounded-2xl border border-border space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">
                      Processing Fee (2%)
                    </span>
                    <span className="text-destructive">
                      -{formatCurrency(serviceFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-bold">Net Payout</span>
                    <span className="text-lg font-black text-primary">
                      {formatCurrency(netAmount)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <DialogClose asChild>
                  <CustomButton
                    type="button"
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </CustomButton>
                </DialogClose>
                <CustomButton
                  className="flex-1"
                  disabled={amount < 100}
                  type="button"
                  onClick={onNext}
                >
                  Proceed
                </CustomButton>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="py-4">
            {/* We use Controller to bridge the PinVault Pin
                input to the React Hook Form state 
            */}
            <Controller
              control={control}
              name="pin"
              render={({ field }) => (
                <PinVault
                  otp={field.value}
                  setOtp={field.onChange}
                  error={
                    errors.pin && errors.pin.message
                      ? { type: "error", message: errors.pin.message }
                      : null
                  }
                  summary={
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Confirm Withdrawal
                      </p>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {formatCurrency(netAmount)}
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Info size={14} />
                        <span className="text-xs font-medium">
                          To GTBank • 0123...890
                        </span>
                      </div>
                    </div>
                  }
                />
              )}
            />

            <div className="flex flex-col gap-3 mt-8">
              <CustomButton type="button" onClick={goBack} variant="secondary">
                Go Back & Edit Amount
              </CustomButton>
              <CustomButton
                isPending={isPending}
                disabled={pin.length < 4}
                className="w-full"
              >
                Confirm Withdrawal
              </CustomButton>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
