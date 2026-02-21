"use client";
import React, { useState, useRef, useEffect, useTransition } from "react";
import { z } from "zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/custom-button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertMessage } from "@/components/alert-message";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const otpSchema = z.string().min(6, "Please enter the 6-digit code.");

export default function OtpForm() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [otp, setOtp] = useState("");
  const [isVerifying, startVerify] = useTransition();
  const [isResending, startResending] = useTransition();
  // Using an object for error/message handling to manage type (error, success, info)
  const [error, setError] = useState<{
    type: "error" | "info" | "success";
    message: string;
  } | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const router = useRouter();

  // Timer useEffect for resending code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    startVerify(async () => {
      const { success, data: parsedOtp } = otpSchema.safeParse(otp);
      if (!success) {
        setError({ type: "error", message: "Please enter the 6-digit code." });
        return;
      }

      if (!isLoaded) return;

      try {
        const completeSignup = await signUp.attemptEmailAddressVerification({
          code: parsedOtp,
        });

        if (completeSignup.status !== "complete") {
          setError({
            type: "error",
            message: "OTP verification failed. Please try again.",
          });
          return;
        }
        await setActive({ session: completeSignup.createdSessionId });
        router.replace("/dashboard/overview");
      } catch (e) {
        console.log(e);
        setError({
          type: "error",
          message: "OTP verification failed. Please try again.",
        });
        return;
      }
    });
  };

  const handleResend = () => {
    startResending(async () => {
      if (!isLoaded) return;
      if (resendTimer === 0) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setResendTimer(60); // Reset timer
        setError({ type: "info", message: "New code sent! Check your inbox." });
      }
    });
  };

  return (
    <form className="space-y-8" onSubmit={handleVerifyOtp}>
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(value) => setOtp(value)}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup className="w-full space-x-4">
          {new Array(6).fill(null).map((_: any, index: number) => (
            <InputOTPSlot
              index={index}
              key={index}
              className="w-full h-12 sm:h-18 text-center text-2xl font-black bg-gray-50 dark:bg-gray-900 border-2 border-l border-transparent   rounded-xl dark:text-white"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {error && <AlertMessage error={error} />}

      <CustomButton disabled={otp.length < 6 || isVerifying} className="w-full">
        Verify Account
      </CustomButton>

      <div className="mt-10 text-center space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Didn't receive the code?
        </p>
        <CustomButton
          disabled={resendTimer > 0 || isResending}
          type="button"
          onClick={handleResend}
        >
          Resend{" "}
          {resendTimer > 0 || isResending
            ? `in 0:${resendTimer.toString().padStart(2, "0")}`
            : "Now"}
        </CustomButton>
      </div>
    </form>
  );
}
