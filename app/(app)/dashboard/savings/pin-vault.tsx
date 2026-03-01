"use client";
import { AlertMessage } from "@/components/alert-message";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { buttonVariants } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface PinVaultProps {
  otp: string;
  setOtp: (value: string) => void;
  error?: { type: "error" | "info" | "success"; message: string } | null;
  summary: React.ReactNode; // This slot allows different designs for different use cases
}

export default function PinVault({
  otp,
  setOtp,
  error,
  summary,
}: PinVaultProps) {
  return (
    <div className="space-y-10 flex flex-col items-center py-4">
      {/* Header Badge */}
      <div className="w-full px-6 flex items-center justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 dark:bg-indigo-900/30 rounded-full">
          <Lock size={12} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            Secure Protocol
          </span>
        </div>
      </div>

      {/* Dynamic Summary Section (Transaction details go here) */}
      <div className="w-full px-8 flex flex-col items-center justify-center text-center">
        {summary}
      </div>

      {/* Input Area */}
      <div className="w-full px-8 flex flex-col items-center space-y-6">
        <InputOTP
          autoFocus
          maxLength={4}
          value={otp}
          onChange={setOtp}
          pattern={REGEXP_ONLY_DIGITS}
          containerClassName="group flex items-center justify-center"
        >
          <InputOTPGroup className="gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <InputOTPSlot
                index={index}
                key={index}
                className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black bg-gray-50 dark:bg-gray-900 border-2 border-transparent !rounded-xl dark:text-white focus-within:ring-2 focus-within:ring-primary"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {/* Message/Error Area */}
        <div className="h-10 flex items-center justify-center w-full">
          {error ? (
            <AlertMessage error={error} />
          ) : (
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              Enter Transaction PIN
            </p>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <Link
        href="/dashboard/settings/security"
        className={buttonVariants({
          variant: "link",
          className:
            "text-[10px] font-black uppercase tracking-widest opacity-70",
        })}
      >
        Forgot PIN?
      </Link>
    </div>
  );
}
