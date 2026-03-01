"use client";
import AsyncSelect from "react-select/async";
import CustomButton from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import {
  updateBankDetailsAction,
  verifyAccountNameAction,
} from "@/server-actions/settings";
import {
  AlertCircle,
  Building,
  CircleUserRound,
  CreditCard,
  Lock,
} from "lucide-react";
import { useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { BankUpdateData, bankUpdateForm } from "@/lib/schema/bank-update-form";
import { BankArray } from "@/lib/schema/paystack";

export default function BankDetailsForm({ banks }: { banks: BankArray }) {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BankUpdateData>({
    resolver: zodResolver(bankUpdateForm),
    defaultValues: {
      bankCode: "",
      accountNumber: "",
      accountName: "",
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);

  const [bank, accNumber] = watch(["bankCode", "accountNumber"]);

  const bankLabelValue = banks.map((bank) => ({
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
      if (accNumber && accNumber.length === 10 && bank) {
        startTransition(async () => {
          const response = await verifyAccountNameAction(accNumber, bank);
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

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      verifyAccount();
    }
  }, [bank, accNumber]);

  const onSubmit = (values: BankUpdateData) => {
    startTransition(async () => {
      const response = await updateBankDetailsAction({
        accountNumber: values.accountNumber,
        bankCode: values.bankCode,
        accountName: values.accountName, // just for validation, not actually used in server action
        password: values.password,
      });

      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              setValue("bankCode", option?.value || "", {
                shouldValidate: true,
              })
            }
          />
        </div>
        {errors.bankCode?.message && (
          <p className="mt-1 flex items-center text-xs text-red-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.bankCode.message}
          </p>
        )}
      </div>

      <FormInput
        id="accountNumber"
        label="Account Number"
        type="text"
        {...register("accountNumber")}
        error={errors.accountNumber?.message}
        icon={<CreditCard className="h-5 w-5" />}
        placeholder="Enter your account number"
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
        {...register("password")}
        error={errors.password?.message}
        icon={<Lock className="h-5 w-5" />}
        placeholder="Enter password to authorize"
        autoComplete="new-password"
      />
      <CustomButton isPending={isPending}>Update Bank Details</CustomButton>
    </form>
  );
}
