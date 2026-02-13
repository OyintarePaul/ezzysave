"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { FormInput, FormSelect } from "../../../../components/form-input";
import { CheckCircle, DollarSign, NotebookPen } from "lucide-react";
import { submitLoanApplication } from "@/server-actions/loans";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { LoanFormData, loanFormSchema } from "@/lib/schema/loan-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/components/custom-button";

export default function LoanApplicationModal() {
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      amount: 0,
      purpose: "",
      duration: 3,
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: LoanFormData) => {
    startTransition(async () => {
      const result = await submitLoanApplication(values);
      if (result.success) {
        toast.success(result.message, {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
        reset();
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <CustomButton
          size="lg"
          className="p-6 text-xl font-semibold rounded-xl"
        >
          Apply for a Loan
        </CustomButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Request a New Loan</DialogTitle>
          <DialogDescription className="mt-2 mb-6 text-gray-600 dark:text-gray-400 space-y-4">
            Please fill out the form below to apply for a new loan. Our team
            will review your application and get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            {...register("amount", { valueAsNumber: true })}
            id="amount"
            label="Loan Amount ($)"
            type="number"
            placeholder="e.g., 5000"
            icon={<DollarSign className="h-5 w-5" />}
            error={errors.amount?.message}
          />
          <FormSelect
            label="Duration"
            {...register("duration", { valueAsNumber: true })}
            onChange={(value) => {
              setValue("duration", +value);
            }}
            options={[
              { label: "3 Months", value: "3", key: 3 },
              { label: "6 Months", value: "6", key: 6 },
              { label: "9 Months", value: "9", key: 9 },
              { label: "12 Months", value: "12", key: 12 },
            ]}
            error={errors.duration?.message}
          />

          <FormInput
            {...register("purpose")}
            id="purpose"
            label="Purpose of Loan"
            placeholder="e.g., Home improvement, car repair..."
            icon={<NotebookPen className="size-5" />}
            error={errors.purpose?.message}
          />
          <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
            <CustomButton
              type="button"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </CustomButton>
            <CustomButton type="submit" isPending={isPending}>
              Submit Request
            </CustomButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
