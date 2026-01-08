"use client";
import CustomButton from "@/components/custom-button";
import { RefreshCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24 lg:px-8 font-sans">
      <div className="text-center max-w-2xl">
        {/* Visual Error State - Warning Icon & Code */}
        <div className="relative mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 shadow-sm animate-bounce">
              <TriangleAlert className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <p className="text-8xl font-black text-gray-200/50 select-none">
            500
          </p>
        </div>

        {/* Messaging */}
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Oops! Something went wrong.
        </h1>
        <p className="mt-6 text-lg leading-7 text-gray-600 max-w-md mx-auto">
          An unexpected error has occurred. Click on the button below to try
          again.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CustomButton onClick={reset} className="w-full sm:w-auto">
            <RefreshCcw className="h-5 w-5" />
            Refresh Page
          </CustomButton>

          <CustomButton asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/dashboard/overview">Go to Home</Link>
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
