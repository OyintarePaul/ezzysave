"use client";
import {
  Dialog,
  DialogContent,
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
import { Loan } from "@/payload-types";
import { formatCurrency } from "@/lib/utils";
import Naira from "@/components/naira-icon";

export default function MakePayment({ loan }: { loan: Loan }) {
  const [paymentData, setPaymentData] = useState({
    amount: 0,
  });

  const [isPending, startTransition] = useTransition();

  const balance = (loan.amount - loan.amountPaid!) * ((100 + loan.interestRate!) / 100)
  const isPayingFull = paymentData.amount == balance;

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

    setPaymentData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting deposit:", paymentData);

    startTransition(async () => {
      const response = await getPaymentLink(paymentData.amount, {
        loanId: loan.id,
      });
      if (!response.success) {
        toast.error("Unable to generate payment link");
        return;
      }

      window.location.href = response.link;
    });
  };

  const handlePayFull = () => {
    setPaymentData((prev) => ({ ...prev, amount: balance }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton className="w-full sm:w-auto px-5 py-2 font-semibold">
          <ArrowUp className="h-5 w-5" />
          <span>Make Payment</span>
        </CustomButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Make a payment</DialogTitle>
        </DialogHeader>

        <div className="my-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wider">
            Remaining Balance
          </p>
          <p className="text-3xl font-extrabold text-primary">
            {formatCurrency(loan.amount - loan.amountPaid!)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="amount"
            label="Amount"
            type="number"
            value={paymentData.amount}
            onChange={handleChange}
            placeholder="e.g., 5000"
            icon={<Naira className="h-4 w-4" />}
          />

          <CustomButton
            type="button"
            variant="outline"
            onClick={handlePayFull}
            className={`w-full text-sm font-bold border-2 transition-all ${isPayingFull ? "bg-green-50 border-primary text-primary" : "border-gray-200 text-gray-500"}`}
          >
            Pay Full Balance
          </CustomButton>

          <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
            <CustomButton
              type="button"
              variant="secondary"
              className="px-6 py-2.5 font-semibold"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 font-semibold h-auto"
            >
              {isPending ? "Processing..." : "Pay now"}
            </CustomButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
