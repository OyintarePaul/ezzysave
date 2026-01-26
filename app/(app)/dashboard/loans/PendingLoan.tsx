import CustomButton from "@/components/custom-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, TriangleAlert } from "lucide-react";

export default function PendingLoan() {
  return (
    <section className="lg:col-span-2 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Pending Application
        </h2>

        <p className="text-gray-600 text-lg mb-8">
          You currently have a loan application under review. Please wait for
          our team to process your existing request before applying for another.
        </p>

        <Alert className="bg-orange-50 border border-orange-200 dark:border-orange-400 dark:text-orange-400 text-orange-500 p-4 mb-10">
          <TriangleAlert className="w-6 h-6  shrink-0" />
          <AlertTitle className="text-orange-800">
            Application Pending
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-oragne-400">
            Only one active application is allowed at a time.
          </AlertDescription>
        </Alert>
      </div>

      <CustomButton
        disabled={true}
        variant="secondary"
        className="w-full px-6 py-4 text-xl font-bold rounded-xl transition-all"
      >
        Application in Progress
      </CustomButton>
    </section>
  );
}
