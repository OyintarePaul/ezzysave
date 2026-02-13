"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTransition } from "react";
import { FormInput } from "../../../../components/form-input";
import { ArrowUp, DollarSign } from "lucide-react";
import CustomButton from "@/components/custom-button";
import { getPaymentLink } from "@/server-actions/payments";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepositFormData, depositFormSchema } from "@/lib/schema/deposit-form";
import { SavingsPlan } from "@/payload-types";

export default function DepositModal({ plan }: { plan: SavingsPlan }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      planId: plan.id,
      amount: 0,
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = ({ amount, planId }: DepositFormData) => {
    startTransition(async () => {
      const response = await getPaymentLink(amount, { planId });
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      window.location.href = response.data as string;
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton className="w-full py-3 font-semibold">
          <ArrowUp className="h-5 w-5" />
          <span>Make a Deposit</span>
        </CustomButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Deposit to your plan</DialogTitle>
          <DialogDescription className="mt-2 mb-6 text-gray-600 dark:text-gray-400">
            Enter the amount you wish to deposit into your savings plan.
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

          <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
            <DialogClose asChild>
              <CustomButton type="button" variant="secondary">
                Cancel
              </CustomButton>
            </DialogClose>
            <CustomButton
              type="submit"
              isPending={isPending}
              className="px-6 py-2.5 font-semibold h-auto"
            >
              Make Deposit
            </CustomButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
