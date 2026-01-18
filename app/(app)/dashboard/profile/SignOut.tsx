"use client";
import CustomButton from "@/components/custom-button";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function SignOut() {
  const { signOut } = useClerk();
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200 dark:bg-gray-800 dark:border-red-700 space-y-4 mt-10">
      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-700 pb-3">
        Session & Security
      </h3>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <p className="text-gray-700 dark:text-gray-300">
          Securely sign out of your EzzySave account.
        </p>
        <CustomButton
          type="button"
          variant="destructive"
          onClick={async () => await signOut({ redirectUrl: "/" })}
          // disabled={isSigningOut}
          className="mt-4 sm:mt-0 text-sm"
        >
          <span className="flex items-center space-x-2">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </span>
        </CustomButton>
      </div>
    </div>
  );
}
