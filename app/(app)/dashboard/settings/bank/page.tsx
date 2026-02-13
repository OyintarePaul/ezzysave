import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageLayout from "../../components/page-layout";
import { getCurrentPayloadCustomer } from "@/data/customers/getCustomer";
import { getBanks } from "@/data/paystack";
import { Wallet } from "lucide-react";
import ModifyBankDetailsModal from "./ModifyBankDetailsModal";

export default async function BankDetailsPage() {
  const [customer, banks] = await Promise.all([
    getCurrentPayloadCustomer(),
    getBanks(),
  ]);

  const bankName = banks.find((bank) => bank.code === customer.bankCode)?.name;
  console.log("Customer Bank Code:", customer.bankCode);

  return (
    <PageLayout
      title="Bank Details"
      subtitle="Manage your bank account details for seamless transactions."
      backHref="/dashboard/settings"
    >
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
            Account Settings
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Bank Details
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Configure where you receive your payouts.
              </p>
            </div>
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500 p-3 rounded-xl text-white">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-900 dark:text-emerald-400">
                    {bankName || "Unknown Bank"} • ****{" "}
                    {customer.accountNumber?.slice(-4)}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    Primary Payout Account
                  </p>
                </div>
              </div>
            </div>

            <ModifyBankDetailsModal banks={banks || []} />
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
