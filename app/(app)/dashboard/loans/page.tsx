import { getCurrentUser, pageAuthGuard } from "@/lib/auth";
import { CircleCheck, FileText, Percent, TriangleAlert } from "lucide-react";
import LoanApplicationModal from "./loan-application-modal";
import LoansList from "./LoansList";
import { Suspense } from "react";
import CustomButton from "@/components/custom-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLoansForUser, getPayloadCustomerByClerkId } from "@/lib/payload";

const LoanApplicationSection = ({
  hasPendingLoan,
}: {
  hasPendingLoan: boolean;
}) => (
  <section className="lg:col-span-2 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
        <FileText className="w-6 h-6 mr-2" />
        Ready to Apply?
      </h2>

      <p className="text-gray-600 text-lg mb-8">
        {hasPendingLoan
          ? "You currently have a loan application under review. Please wait for our team to process your existing request before applying for another."
          : "Skip the estimations and begin your official application right now. Our process is fast, secure, and provides a decision in minutes."}
      </p>

      {hasPendingLoan ? (
        <Alert className="bg-orange-50 border border-orange-200 dark:border-orange-400 dark:text-orange-400 text-orange-500 p-4 mb-10">
          <TriangleAlert className="w-6 h-6  shrink-0" />
          <AlertTitle className="text-orange-800">
            Application Pending
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-oragne-400">
            Only one active application is allowed at a time.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="flex items-center space-x-3 p-4 bg-primary/10 rounded-xl text-primary">
            <CircleCheck className="w-5 h-5" />
            <span className="font-semibold">Quick Pre-Approval</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-primary/10 rounded-xl text-primary">
            <Percent className="w-5 h-5" />
            <span className="font-semibold">Competitive Rates</span>
          </div>
        </div>
      )}
    </div>

    {hasPendingLoan ? (
      <CustomButton
        disabled={hasPendingLoan}
        variant="secondary"
        className="w-full px-6 py-4 text-xl font-bold rounded-xl transition-all"
      >
        Application in Progress
      </CustomButton>
    ) : (
      <LoanApplicationModal />
    )}
  </section>
);

const Loans = async () => {
  const user = await getCurrentUser();
  const customer = await getPayloadCustomerByClerkId(user!.id);
  if (!customer) {
    throw new Error("Customer not found");
  }
  const loans = await getLoansForUser(customer.id);
  const pendingLoans = loans.filter((l) => l.status === "pending");

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
        <LoanApplicationSection hasPendingLoan={pendingLoans.length > 0} />
        <Suspense fallback={<div>Loading...</div>}>
          <LoansList loans={loans} />
        </Suspense>
      </main>
    </div>
  );
};

export default async function LoansPage() {
  pageAuthGuard("/loans");
  return <Loans />;
}
