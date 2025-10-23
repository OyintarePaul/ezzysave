"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle,
  DollarSign,
  List,
  Settings,
  Target,
  Zap,
  Lock,
} from "lucide-react";
import { useState } from "react";

interface SavingsFormData {
  planType: "Daily" | "Target" | "Fixed";
  planName: string;
  initialDeposit: number;
  // Fixed specific
  termMonths?: number;
  // Target specific
  targetAmount?: number;
  targetDate?: string;
  // Daily specific
  dailyAmount?: number;
  dailyDays?: number;
}

const CreateSavingsPlanPage: React.FC<{ userId: string; db: any }> = ({}) => {
  const [formData, setFormData] = useState<SavingsFormData>({
    planType: "Target",
    planName: "",
    initialDeposit: 100,
    targetAmount: 5000,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .substring(0, 10),
    dailyAmount: 5,
    dailyDays: 365,
    termMonths: 12,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const PLAN_TYPES: { [key: string]: "Daily" | "Target" | "Fixed" } = {
    DAILY: "Daily",
    TARGET: "Target",
    FIXED: "Fixed",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let val: string | number = value;

    if (
      type === "number" ||
      name === "initialDeposit" ||
      name === "targetAmount" ||
      name === "dailyAmount" ||
      name === "dailyDays" ||
      name === "termMonths"
    ) {
      val = value === "" ? 0 : parseFloat(value);
      if (isNaN(val)) val = 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val as any,
    }));
  };

  const handleTypeChange = (newType: "Daily" | "Target" | "Fixed") => {
    setFormData((prev) => ({
      ...prev,
      planType: newType,
    }));
    setStatusMessage(null);
  };

  const renderTypeSpecificFields = () => {
    const type = formData.planType;

    if (type === PLAN_TYPES.DAILY) {
      const dailyDeposit = formData.dailyAmount || 0;
      const totalDays = formData.dailyDays || 0;
      const projectedTotal = dailyDeposit * totalDays + formData.initialDeposit;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              id="dailyAmount"
              value={formData["dailyAmount"] as number}
              handleChange={handleChange}
              label="Daily Contribution ($)"
              name="dailyAmount"
              type="number"
              min="1"
              placeholder="e.g., 5"
            />
            <InputGroup
              id="dailyDays"
              value={formData["dailyDays"] as number}
              handleChange={handleChange}
              label="Duration (Days)"
              name="dailyDays"
              type="number"
              min="7"
              placeholder="e.g., 365"
            />
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-300 font-semibold flex justify-between items-center">
            <p>Projected Total Savings:</p>
            <p className="text-lg">{formatCurrency(projectedTotal)}</p>
          </div>
        </div>
      );
    } else if (type === PLAN_TYPES.TARGET) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              id="targetAmount"
              value={formData["targetAmount"] as number}
              handleChange={handleChange}
              label="Target Amount ($)"
              name="targetAmount"
              type="number"
              min="100"
              placeholder="e.g., 5000"
            />
            <InputGroup
              id="targetDate"
              value={formData["targetDate"] as string}
              handleChange={handleChange}
              label="Target Completion Date"
              name="targetDate"
              type="date"
              min={new Date().toISOString().substring(0, 10)}
            />
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-sm text-green-800 dark:text-green-300 font-semibold flex justify-between items-center">
            <p>Estimated APY:</p>
            <p className="text-lg">3.8%</p>
          </div>
        </div>
      );
    } else if (type === PLAN_TYPES.FIXED) {
      const termMonths = formData.termMonths || 12;
      const rateFixed = (
        termMonths >= 24 ? 5.5 : termMonths >= 12 ? 4.0 : 3.0
      ).toFixed(1);
      return (
        <div className="space-y-4">
          <InputGroup
            value={formData["termMonths"] as number}
            handleChange={handleChange}
            id="termMonths"
            label="Investment Term"
            name="termMonths"
            isSelect={true}
          />
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-300 font-semibold flex justify-between items-center">
            <p>Guaranteed APY for {termMonths} months:</p>
            <p className="text-lg">{rateFixed}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 pb-20 lg:pb-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Start a New Savings Plan
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Define your goal, choose a plan type, and set your initial
          contribution.
        </p>
      </header>

      <Card className="p-6 space-y-8">
        {/* Step 1: Plan Type Selection */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <List className="w-5 h-5 mr-2 text-primary" /> 1. Select Plan Type
          </h2>
          <PlanTypeSelector
            currentType={formData.planType}
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

        <form className="space-y-8">
          {/* Step 2: Plan Details */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-primary" /> 2. Define
              Plan Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="planName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Plan Name
                </label>
                <input
                  type="text"
                  id="planName"
                  name="planName"
                  value={formData.planName}
                  onChange={handleChange}
                  placeholder="e.g., Vacation, Down Payment"
                  required
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="initialDeposit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Initial Deposit ($)
                </label>
                <input
                  type="number"
                  id="initialDeposit"
                  name="initialDeposit"
                  value={formData.initialDeposit || ""}
                  onChange={handleChange}
                  min="0"
                  required
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Type Specific Settings */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary" /> 3.{" "}
              {formData.planType} Settings
            </h2>
            {renderTypeSpecificFields()}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              isLoading || !formData.planName || formData.initialDeposit < 0
            }
            className={`w-full flex justify-center items-center py-3 px-4 shadow-lg text-base ${
              isLoading
                ? "bg-primary/40 text-primary-foreground"
                : "transform hover:scale-[1.005]"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Plan...
              </>
            ) : (
              `Confirm & Launch ${formData.planType} Plan`
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

const PlanTypeSelector: React.FC<{
  currentType: "Daily" | "Target" | "Fixed";
  onChange: (type: "Daily" | "Target" | "Fixed") => void;
}> = ({ currentType, onChange }) => {
  const types = [
    {
      type: "Target",
      name: "Goal Saver",
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
      name: "Micro Saver",
      icon: Zap,
      color: "text-yellow-500",
      description:
        "Set small, automated daily contributions to build savings habits effortlessly.",
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
            className={`
                            p-4 rounded-xl text-left transition-all duration-300 transform
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

const InputGroup: React.FC<{
  id: string;
  label: string;
  name: keyof SavingsFormData;
  type?: string;
  min?: string | number;
  value: string | number;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  isSelect?: boolean;
  isLoading?: boolean;
}> = ({
  id,
  label,
  name,
  type = "text",
  min,
  value,
  handleChange,
  placeholder,
  isLoading,
  required = true,
  isSelect = false,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    {isSelect ? (
      <select
        id={id}
        name={name as string}
        value={value as number}
        onChange={handleChange}
        required={required}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value={6}>6 Months (3.0% APY)</option>
        <option value={12}>12 Months (4.0% APY)</option>
        <option value={24}>24 Months (5.5% APY)</option>
        <option value={36}>36 Months (5.5% APY)</option>
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={name as string}
        value={(value as string | number) || ""}
        onChange={handleChange}
        min={min}
        placeholder={placeholder}
        required={required}
        disabled={isLoading}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
      />
    )}
  </div>
);

export default CreateSavingsPlanPage;
