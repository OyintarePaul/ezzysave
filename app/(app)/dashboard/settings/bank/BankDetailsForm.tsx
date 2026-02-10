"use client";
import CustomButton from "@/components/custom-button";
import { FormInput, FormSelect } from "@/components/form-input";
import { z } from "zod";
import {
  updateBankDetails,
  verifyAccountName,
} from "@/server-actions/settings";
import { Building, CircleUserRound, CreditCard, Lock } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  bank: z.string().min(1, "Bank name is required"),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(10, "Account number must be at most 10 digits"),
  accountName: z.string().min(1, "Account name is not yet verified"),
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function BankDetailsForm({
  banks,
  bankCode,
  accountNumber,
  accountName,
}: {
  banks: any[];
  accountNumber: string;
  accountName: string;
  bankCode: string;
}) {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank: bankCode,
      accountNumber: accountNumber,
      accountName: accountName,
      currentPassword: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);

  const [bank, accNumber] = watch(["bank", "accountNumber"]);

  useEffect(() => {
    const verifyAccount = async () => {
      console.log("running verify account");
      if (accNumber && accNumber.length === 10) {
        startTransition(async () => {
          const response = await verifyAccountName(accNumber, bank);
          if (response.success) {
            startTransition(() => {
              setValue("accountName", response.data!, { shouldValidate: true });
            });
          } else {
            toast.error("Couldn't verify your account.");
          }
        });
      }
    };

    console.log(isInitialMount.current);
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      verifyAccount();
    }
  }, [bank, accNumber]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const response = await updateBankDetails(
        values.accountNumber,
        values.bank,
        values.currentPassword,
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        id="accountNumber"
        label="Account Number"
        type="text"
        {...register("accountNumber")}
        error={errors.accountNumber?.message}
        icon={<CreditCard className="h-5 w-5" />}
        placeholder="Enter your account number"
      />

      <Controller
        control={control}
        name="bank"
        render={({ field }) => (
          <FormSelect
            label="Bank Name"
            {...field}
            onChange={(value) => {
              field.onChange(value); // Update react-hook-form state
            }}
            error={errors.bank?.message}
            icon={<Building className="h-5 w-5" />}
            options={banks.map((bank: any, index: number) => ({
              label: bank.name,
              value: bank.code,
              key: index,
            }))}
          />
        )}
      />

      <FormInput
        id="accountName"
        label="Account Name"
        type="text"
        {...register("accountName")}
        error={errors.accountName?.message}
        icon={<CircleUserRound className="h-5 w-5" />}
        readOnly
        placeholder="Account Name"
      />
      <FormInput
        id="currentPassword"
        label="Password"
        type="password"
        {...register("currentPassword")}
        error={errors.currentPassword?.message}
        icon={<Lock className="h-5 w-5" />}
        placeholder="Enter password to authorize"
        autoComplete="new-password"
      />
      <CustomButton size="sm" disabled={isPending} isPending={isPending}>
        Update Bank Details
      </CustomButton>
    </form>
  );
}
