import CustomButton from "@/components/custom-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import BankDetailsForm from "./BankDetailsForm";
import { BankArray } from "@/lib/schema/paystack";

export default function ModifyBankDetailsModal({ banks }: { banks: BankArray }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton>Modify Bank Details</CustomButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Modify Bank Details</DialogTitle>
          <DialogDescription className="mt-2 mb-6 text-gray-600 dark:text-gray-400">
            Update your bank account details for payouts.
          </DialogDescription>
        </DialogHeader>

        <BankDetailsForm banks={banks} />
      </DialogContent>
    </Dialog>
  );
}
