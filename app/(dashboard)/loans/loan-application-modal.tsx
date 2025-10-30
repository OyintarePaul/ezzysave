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
import { useState } from "react";
import { FormInput } from "../components/form-input";
import { DollarSign } from "lucide-react";

export default function LoanApplicationModal() {
  const [loanData, setLoanData] = useState({
    loanAmount: 0,
    purpose: "",
    term: "12",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    let val: string | number = value;

    // Use the number conversion logic you asked about
    if (type === "number" || name === "loanAmount") {
      val = value === "" ? 0 : parseFloat(value);
      if (isNaN(val)) val = 0;
    }

    setLoanData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting loan application:", loanData);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false); // Close modal on success
      setLoanData({ loanAmount: 0, purpose: "", term: "12" }); // Reset form
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full p-6 text-xl font-semibold rounded-xl"
        >
          Apply for a Loan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Request a New Loan</DialogTitle>
          <DialogDescription className="mt-2 mb-6 text-gray-600 dark:text-gray-400">
            Please fill out the form below to apply for a new loan. Our team
            will review your application and get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="loanAmount"
            label="Loan Amount ($)"
            type="number"
            value={loanData.loanAmount}
            onChange={handleChange}
            placeholder="e.g., 5000"
            icon={<DollarSign className="h-5 w-5" />}
          />
          {/* <FormSelect
                        id="term"
                        label="Repayment Term"
                        value={loanData.term}
                        onChange={handleChange}
                    >
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                        <option value="24">24 Months</option>
                        <option value="36">36 Months</option>
                    </FormSelect> */}
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
              disabled={isSubmitting}
              className="px-6 py-2.5 font-semibold h-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
