
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
import { FormInput, FormSelect } from "../../../../components/form-input";
import { CheckCircle, DollarSign } from "lucide-react";
import { submitLoanApplication } from "@/server-actions/loans";
import { toast } from "sonner";

export default function LoanApplicationModal() {
  const [loanData, setLoanData] = useState({
    amount: 0,
    purpose: "",
    duration: 12,
  });

  const [isOpen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    let val: string | number = value;
    console.log("Handling change for ", name, " with value: ", value);

    // Use the number conversion logic you asked about
    if (type === "number" || name === "amount" || name === "duration") {
      val = value === "" ? 0 : parseFloat(value);
      if (isNaN(val)) val = 0;
    }

    setLoanData((prev) => ({ ...prev, [name]: val }));
  };

  const onDurationChange = (value: string) => {
    const duration = parseInt(value);
    setLoanData((prev) => ({
      ...prev,
      duration: isNaN(duration) ? 12 : duration,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitLoanApplication(loanData);
      if (result.success) {
        toast.success("Loan application submitted successfully!", {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
        setIsOpen(false);
        setLoanData({
          amount: 0,
          purpose: "",
          duration: 12,
        });
      } else {
        toast.error(
          result.error
        );
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="p-6 text-xl font-semibold rounded-xl">
          Apply for a Loan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Request a New Loan</DialogTitle>
          <DialogDescription className="mt-2 mb-6 text-gray-600 dark:text-gray-400 space-y-4">
            Please fill out the form below to apply for a new loan. Our team
            will review your application and get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="amount"
            label="Loan Amount ($)"
            value={loanData.amount}
            onChange={handleChange}
            type="number"
            placeholder="e.g., 5000"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <FormSelect
            name="duration"
            label="Repayment Term"
            value={loanData.duration.toString()}
            onChange={onDurationChange}
            className="w-full rounded-lg"
            options={[
              { label: "6 Months", value: "6", key: 6 },
              { label: "12 Months", value: "12", key: 12},
              { label: "24 Months", value: "24", key: 24 },
              { label: "36 Months", value: "36", key: 36 },
            ]}
          />

          <FormInput
            id="purpose"
            label="Purpose of Loan"
            as="textarea"
            value={loanData.purpose}
            onChange={handleChange}
            placeholder="e.g., Home improvement, car repair..."
          />
          <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
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
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
