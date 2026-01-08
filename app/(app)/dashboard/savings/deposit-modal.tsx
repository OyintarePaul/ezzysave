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
import { FormInput } from "../../../../components/form-input";
import { ArrowUp, DollarSign } from "lucide-react";
import CustomButton from "@/components/custom-button";
import { getPaymentLink } from "@/server-actions/payments";
import { toast } from "sonner";

export default function DepositModal({ planId }: { planId: string }) {
  const [depositData, setDepositData] = useState({
    amount: 0,
  });
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    let val: string | number = value;

    // Use the number conversion logic you asked about
    if (type === "number" || name === "amount") {
      val = value === "" ? 0 : parseFloat(value);
      if (isNaN(val)) val = 0;
    }

    setDepositData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting deposit:", depositData);
    // Simulate API call
    startTransition(async () => {
      const response = await getPaymentLink(depositData.amount, { planId });
      if (!response.success) {
        toast.error("Unable to generate payment link");
        return;
      }

      window.location.href = response.link;
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="amount"
            label="Amount ($)"
            type="number"
            value={depositData.amount}
            onChange={handleChange}
            placeholder="e.g., 5000"
            icon={<DollarSign className="h-5 w-5" />}
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
              {isPending ? "Processing..." : "Make deposit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
