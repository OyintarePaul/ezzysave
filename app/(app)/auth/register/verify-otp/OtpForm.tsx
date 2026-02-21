"use client";
import React, { useState, useEffect, useTransition } from "react";
import { z } from "zod";
import { useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
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

        if (completeSignup.status == "complete") {
          await setActive({ session: completeSignup.createdSessionId });
          router.replace("/dashboard/overview");
        }
      } catch (e) {
        if (isClerkAPIResponseError(e)) {
          const clerkError = e.errors[0];
          switch (clerkError.code) {
            case "form_param_value_invalid":
              setError({
                type: "error",
                message:
                  "That code doesn't look right. Please check and try again.",
              });
              break;
            case "verification_expired":
              setError({
                type: "error",
                message: "This code has expired. Please request a new one.",
              });
              break;
            case "too_many_attempts":
              setError({
                type: "error",
                message:
                  "Too many failed attempts. Please wait a while before trying again.",
              });
              break;
            default:
              setError({
                type: "error",
                message: clerkError.longMessage || "An unknown error occurred.",
              });
          }
        } else {
          // Handle non-clerk errors (network issues, etc.)
          setError({
            type: "error",
            message:
              "OTP verification failed. Please check your connection and try again.",
          });
        }
      }
    });
  };

  const handleResend = () => {
    startResending(async () => {
      if (!isLoaded || !signUp) return;

      // Only attempt if the timer has reached zero
      if (resendTimer === 0) {
        try {
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });

          // SUCCESS
          setResendTimer(60); // Reset the cooldown
          setError({
            type: "info",
            message: "New code sent! Check your inbox.",
          });
        } catch (err: unknown) {
          // ERROR HANDLING
          if (isClerkAPIResponseError(err)) {
            const clerkError = err.errors[0];

            if (clerkError.code === "too_many_attempts") {
              setError({
                type: "error",
                message:
                  "Too many requests. Please wait a moment before trying again.",
              });
            } else {
              setError({
                type: "error",
                message: clerkError.longMessage || "Failed to resend code.",
              });
            }
          } else {
            setError({
              type: "error",
              message: "Unable to resend OTP. Please try again.",
            });
          }
        }
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
