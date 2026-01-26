import { getCurrentUser, pageAuthGuard } from "@/lib/auth";
import LoansList from "./LoansList";
import { Suspense } from "react";
import {
  getLoansForCustomer,
  getPayloadCustomerByClerkId,
} from "@/lib/payload";
import ActiveLoan from "./ActiveLoan";
import PendingLoan from "./PendingLoan";
import LoanApplicationSection from "./LoanApplication";
import ApprovedLoan from "./ApprovedLoan";

const LoansPage = async () => {
  await pageAuthGuard("/loans");
  const user = await getCurrentUser();
  const customer = await getPayloadCustomerByClerkId(user.id);
  if (!customer) {
    throw new Error("Customer not found");
  }
  const loans = await getLoansForCustomer(customer.id);
  const pendingLoans = loans.filter((l) => l.status === "pending");
  const activeLoans = loans.filter((l) => l.status == "active");
  const approvedLoans = loans.filter((l) => l.status == "approved");

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-16 lg:pb-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          EzzySave Loan Center
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your outstanding credit and apply for new loans.
        </p>
      </header>

      <main className="space-y-8">
        {activeLoans.length > 0 && <ActiveLoan loan={activeLoans[0]} />}

        {pendingLoans.length > 0 && <PendingLoan />}

        {activeLoans.length == 0 && pendingLoans.length == 0 && (
          <LoanApplicationSection />
        )}

        {approvedLoans.length > 0 && <ApprovedLoan loan={approvedLoans[0]} />}

        <Suspense fallback={<div>Loading...</div>}>
          <LoansList loans={loans} />
        </Suspense>
      </main>
    </div>
  );
};

export default LoansPage;
