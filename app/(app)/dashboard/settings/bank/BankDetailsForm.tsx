"use client";
import AsyncSelect from "react-select/async";
import CustomButton from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import { z } from "zod";
import {
  updateBankDetails,
  verifyAccountName,
} from "@/server-actions/settings";
import {
  AlertCircle,
  Building,
  CircleUserRound,
  CreditCard,
  Lock,
} from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  bank: z.string().min(1, "Bank name is required"),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(10, "Account number must be at most 10 digits"),
  accountName: z.string().min(1, "Account name is not yet verified"),
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function BankDetailsForm({ banks }: { banks: any[] }) {
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
      bank: "",
      accountNumber: "",
      accountName: "",
      currentPassword: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);

  const [bank, accNumber] = watch(["bank", "accountNumber"]);

  const bankLabelValue = banks.map((bank: any) => ({
    label: bank.name,
    value: bank.code,
  }));

  const promiseOptions = (inputValue: string) => {
    return new Promise<{ label: string; value: string }[]>((resolve) => {
      const filtered = bankLabelValue.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
      resolve(filtered);
    });
  };

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

      {/* one time react-select async component to improve performance of bank selection */}
      <div className="space-y-2">
        <Label
          htmlFor="bank"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Bank Name
        </Label>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-15">
            <Building className="size-5" />
          </span>
          <AsyncSelect
            id="bank"
            cacheOptions
            placeholder="Select a bank"
            unstyled
            defaultOptions={false}
            loadOptions={promiseOptions}
            classNames={{
              control: ({ isFocused }) =>
                `flex w-full text-sm rounded-lg border border-input bg-background p-3 pl-10 ring-offset-background placeholder:text-muted-foreground focus-within:border-primary/70 focus-within:ring-primary/70 focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ${
                  isFocused ? "border-ring" : "border-input"
                }`,
              menu: () =>
                "relative mt-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
              option: ({ isFocused, isSelected }) =>
                `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isFocused
                      ? "bg-accent text-accent-foreground"
                      : ""
                }`,
              placeholder: () => "text-muted-foreground",
              singleValue: () => "text-foreground text-sm",
              multiValue: () =>
                "bg-secondary text-secondary-foreground rounded-sm px-1 m-0.5",
              multiValueLabel: () => "text-xs px-1",
              multiValueRemove: () =>
                "hover:bg-destructive hover:text-destructive-foreground rounded-sm",
              input: () => "text-sm",
            }}
            onChange={(option) =>
              setValue("bank", option?.value || "", { shouldValidate: true })
            }
          />
        </div>
        {errors.bank?.message && (
          <p className="mt-1 flex items-center text-xs text-red-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.bank.message}
          </p>
        )}
      </div>

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
