import { CircleCheck, FileText, Percent, TriangleAlert } from "lucide-react";
import LoanApplicationModal from "./LoanApplicationModal"

export default function LoanApplicationSection() {
  return (
    <section className="lg:col-span-2 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Ready to Apply?
        </h2>

        <p className="text-gray-600 text-lg mb-8">
          Skip the estimations and begin your official application right now.
          Our process is fast, secure, and provides a decision in minutes.{" "}
        </p>

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
      </div>

      <LoanApplicationModal />
    </section>
  );
}
