"use client";
import CustomButton from "@/components/custom-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  DollarSign,
  List,
  Settings,
  Target,
  Zap,
  Lock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getPaymentLink } from "@/server-actions/payments";
import { createSavingsPlanAction } from "@/server-actions/savings-plans";
import { useState, useTransition } from "react";
import { savingsSchema, type SavingsFormData } from "@/lib/schema/savings";
import { FormInput, FormSelect } from "@/components/form-input";
import { useRouter } from "next/navigation";

export default function CreatePlanForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SavingsFormData>({
    resolver: zodResolver(savingsSchema),
    defaultValues: {
      planType: "Target",
      planName: "",
      initialDeposit: 0,
      targetAmount: 0,
      targetDate: "",
    },
  });

  const values = watch();

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleTypeChange = (newType: "Daily" | "Target" | "Fixed") => {
    reset();
    setValue("planType", newType, { shouldValidate: true });
    setStatusMessage(null);
  };

  const onSubmit = async (values: SavingsFormData) => {
    setStatusMessage(null);
    startTransition(async () => {
      let response;
      if (values.planType === "Daily") {
        response = await createSavingsPlanAction({
          planName: values.planName,
          planType: values.planType,
          initialDeposit: values.initialDeposit,
          dailyAmount: values.dailyAmount,
          numberOfDays: values.numberOfDays,
        });
      } else if (values.planType === "Fixed") {
        response = await createSavingsPlanAction({
          planName: values.planName,
          planType: values.planType,
          initialDeposit: values.initialDeposit,
          fixedAmount: values.fixedAmount,
          fixedDuration: values.fixedDuration,
        });
      } else if (values.planType === "Target") {
        response = await createSavingsPlanAction({
          planName: values.planName,
          planType: values.planType,
          initialDeposit: values.initialDeposit,
          targetAmount: values.targetAmount,
          targetDate: values.targetDate,
        });
      }

      if (!response?.success) {
        setStatusMessage({
          type: "error",
          text:
            response?.message ||
            "Something went wrong. Please try again later.",
        });
        return;
      } else if (response?.success) {
        setStatusMessage({
          type: "success",
          text: "Savings plan created successfully. Redirecting...",
        });
      }

      if (!values.initialDeposit) {
        router.push("/dashboard/savings");
        return;
      }

      const res = await getPaymentLink(values.initialDeposit, {
        planId: response?.data?.id || "",
      });

      if (!res.success) {
        setStatusMessage({
          type: "error",
          text: "Unable to redirect to payment. You can contine payment on the savings page",
        });
        router.push(`/dasboard/savings/${response?.data?.id}`);
        return;
      }

      window.location.href = res.data as string;
    });
  };

  const renderTypeSpecificFields = () => {
    if (values.planType === "Daily") {
      const dailyDeposit = values.dailyAmount || 0;
      const totalDays = values.numberOfDays || 0;
      const initialDeposit = values.initialDeposit || 0;
      const projectedTotal = initialDeposit + dailyDeposit * totalDays;

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              {...register("dailyAmount", { valueAsNumber: true })}
              label="Daily Contribution (NGN)"
              type="number"
              placeholder="e.g., 50"
              error={errors["dailyAmount" as keyof typeof errors]?.message}
            />
            <FormInput
              {...register("numberOfDays", { valueAsNumber: true })}
              label="Duration (Days)"
              type="number"
              placeholder="e.g., 365"
              error={errors["numberOfDays" as keyof typeof errors]?.message}
            />
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-300 font-semibold flex justify-between items-center">
            <p>Projected Total Savings:</p>
            <p className="text-lg">{formatCurrency(projectedTotal)}</p>
          </div>
        </div>
      );
    } else if (values.planType === "Target") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              {...register("targetAmount", { valueAsNumber: true })}
              label="Target Amount ($)"
              type="number"
              placeholder="e.g., 5000"
              error={errors["targetAmount" as keyof typeof errors]?.message}
            />
            <FormInput
              {...register("targetDate")}
              label="Target Completion Date"
              type="date"
              min={new Date().toISOString().substring(0, 10)}
              error={errors["targetDate" as keyof typeof errors]?.message}
            />
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-sm text-green-800 dark:text-green-300 font-semibold flex justify-between items-center">
            <p>Withdrawal Charge:</p>
            <p className="text-lg">2%</p>
          </div>
        </div>
      );
    } else if (values.planType === "Fixed") {
      const duration = values.fixedDuration || 12;

      return (
        <div className="space-y-4">
          <FormSelect
            {...register("fixedDuration")}
            onChange={(value) => {
              setValue("fixedDuration", +value, { shouldValidate: true });
            }}
            label="Duration"
            error={errors["fixedDuration" as keyof typeof errors]?.message}
            options={[
              {
                label: "3 months",
                value: "3",
                key: 3,
              },
              {
                label: "6 months",
                value: "6",
                key: 6,
              },
              {
                label: "9 months",
                value: "9",
                key: 9,
              },
            ]}
          />
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-300 font-semibold flex justify-between items-center">
            <p>Guaranteed APY for {duration} months:</p>
            <p className="text-lg">3%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Plan Type Selection */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <List className="w-5 h-5 mr-2 text-primary" /> 1. Select Plan Type
        </h2>
        <PlanTypeSelector
          currentType={values.planType}
          onChange={handleTypeChange}
        />
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center ${
            statusMessage.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
          }`}
        >
          <CheckCircle className="w-5 h-5 mr-3" />
          <p className="text-sm font-medium">{statusMessage.text}</p>
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Step 2: Plan Details */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-primary" /> 2. Define Plan
            Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormInput
                {...register("planName")}
                label="Plan Name"
                placeholder="e.g., New phone"
                error={errors.planName?.message}
              />
            </div>

            <div>
              <FormInput
                {...register("initialDeposit", { valueAsNumber: true })}
                label="Initial Deposit"
                type="number"
                placeholder="e.g., 500"
                error={errors.initialDeposit?.message}
              />
            </div>
          </div>
        </div>

        {/* Step 3: Type Specific Settings */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-primary" /> 3.{" "}
            {values.planType} Settings
          </h2>
          {renderTypeSpecificFields()}
        </div>

        {/* Submit Button */}
        <CustomButton
          disabled={isPending}
          isPending={isPending}
          className="w-full"
        >
          {`Confirm & Launch ${values.planType} Plan`}
        </CustomButton>
      </form>
    </div>
  );
}

const PlanTypeSelector: React.FC<{
  currentType: "Daily" | "Target" | "Fixed";
  onChange: (type: "Daily" | "Target" | "Fixed") => void;
}> = ({ currentType, onChange }) => {
  const types = [
    {
      type: "Target",
      name: "Target Savings",
      icon: Target,
      color: "text-green-500",
      description:
        "Save towards a specific amount by a set date, offering competitive rates.",
    },
    {
      type: "Fixed",
      name: "Fixed Deposit",
      icon: Lock,
      color: "text-blue-500",
      description:
        "Lock funds for a set period (e.g., 12-36 months) for guaranteed, high interest.",
    },
    {
      type: "Daily",
      name: "Daily Savings",
      icon: Zap,
      color: "text-yellow-500",
      description:
        "Set small, daily contributions to build savings habits effortlessly.",
    },
  ] as const;

  return (
    // Grid layout: 1 column on mobile, 3 columns on medium screens and up.
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {types.map(({ type, name, icon: Icon, color, description }) => {
        const isSelected = currentType === type;

        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`p-4 rounded-xl text-left transition-all duration-300 transform
                        focus:outline-none focus:ring-4 focus:ring-primary/50
                        ${
                          isSelected
                            ? "bg-primary/10 border-2 border-primary/60 shadow-lg scale-[1.01]"
                            : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:shadow-md"
                        }
                        `}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon className={`w-6 h-6 ${color}`} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {name}
              </h3>
              {isSelected && (
                <CheckCircle className="w-5 h-5 text-primary ml-auto" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </button>
        );
      })}
    </div>
  );
};
