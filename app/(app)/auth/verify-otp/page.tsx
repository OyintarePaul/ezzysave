"use client";
import { ShieldCheck } from "lucide-react";
import OtpForm from "./OtpForm";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const VerifyOtpPage = () => {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    // Only run this logic once Clerk has finished loading
    if (isLoaded) {
      // If there is no sign-up object OR no email has been submitted yet
      if (!signUp || !signUp.emailAddress) {
        console.warn(
          "No pending sign-up found. Redirecting to sign-up page...",
        );
        router.push("/auth/register");
      }
    }
  }, [isLoaded, signUp, router]);

  const pendingEmail = signUp?.emailAddress || "";

  return (
    <>
      <div className="text-center space-y-3 mb-10">
        <div className="flex justify-center items-center text-primary mb-2">
          <div className="p-4 bg-primary/10 rounded-2xl">
            <ShieldCheck className="h-10 w-10 stroke-[1.5]" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Verify Your Email
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          We've sent a 6-digit code to{" "}
          <span className="text-gray-900 dark:text-gray-200 font-bold">
            {pendingEmail}
          </span>
        </p>
      </div>

      {/* Otp Form */}
      <OtpForm />
    </>
  );
};

export default VerifyOtpPage;
