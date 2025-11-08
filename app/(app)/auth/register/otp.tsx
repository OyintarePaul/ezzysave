"use client";
import { useState, useRef, useEffect } from "react";
import { KeySquare, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import CustomButton from "@/components/custom-button";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

interface OTPVerificationProps {
  email: string;
}

const OTPVerification = ({ email }: OTPVerificationProps) => {
  // State for the 6 individual OTP digits
  const { signUp, isLoaded, setActive } = useSignUp();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  // Using an object for error/message handling to manage type (error, success, info)
  const [error, setError] = useState<{ type: string; message: string } | null>(
    null
  );
  const [resendTimer, setResendTimer] = useState(60);
  const router = useRouter();

  // Array of refs to manage focus on each input field
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  
  // Mock value for demonstration
  
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
  
  if (!isLoaded) return null;
  
  const handleVerifyOtp = async (otp: string) => {
    console.log("Verifying OTP:", otp);
    setIsLoading(true);

    if (!otp || otp.length !== 6) {
      setError({ type: "error", message: "Please enter the 6-digit code." });
      setIsLoading(false);
      return;
    }

    try {
      const completeSignup = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (completeSignup.status !== "complete") {
        setIsLoading(false);
        setError({
          type: "error",
          message: "OTP verification failed. Please try again.",
        });
        return;
      }
      await setActive({ session: completeSignup.createdSessionId });
      setIsLoading(false);

      router.replace("/dashboard/overview");
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setError({
        type: "error",
        message: "OTP verification failed. Please try again.",
      });
      return;
    }
  };

  // Handle input change and focus movement
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only take the last digit entered
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if the last digit is entered
  };

  // Handle backspace and cursor keys
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event (paste the full 6-digit code)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      // Move focus to the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      setResendTimer(60); // Reset timer
      setError({ type: "info", message: "New code sent! Check your inbox." });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="text-center space-y-3 mb-8">
        <div className="flex justify-center items-center text-primary">
          <KeySquare className="h-10 w-10 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Verify Your Account
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          A 6-digit verification code has been sent to{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {email}
          </span>
          .
        </p>
      </div>

      <form className="space-y-8">
        {/* OTP Input Grid */}
        <div
          className="flex justify-center space-x-2 sm:space-x-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="tel" // Use tel for mobile numeric keyboard
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoFocus={index === 0}
              className="w-10 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary outline-none transition duration-150"
              style={{ caretColor: "transparent" }} // Hide cursor for better UX
            />
          ))}
        </div>

        {/* Error/Info Message Display */}
        {error && (
          <div
            className={`p-3 text-sm rounded-lg flex items-center space-x-2 ${
              error.type === "error"
                ? "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300"
                : error.type === "success"
                ? "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300"
                : "text-primary bg-primary/10"
            }`}
            role="alert"
          >
            {error.type === "error" && (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            )}
            {error.type === "success" && (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            )}
            {error.type === "info" && (
              <KeySquare className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{error.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <CustomButton
            type="button"
            onClick={() => handleVerifyOtp(otp.join(""))}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full text-base tracking-wide"
          >
            {isLoading ? (
              <>
                <Spinner />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Verify Code</span>
              </>
            )}
          </CustomButton>

          <CustomButton
            type="button"
            variant="secondary"
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="w-full text-sm text-gray-700"
          >
            {resendTimer > 0 ? (
              `Resend Code in ${resendTimer}s`
            ) : (
              <span className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Resend Code</span>
              </span>
            )}
          </CustomButton>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          href="/" // Link to contact support
          className="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition duration-150"
        >
          Need help? Contact support
        </Link>
      </div>
    </div>
  );
};

export default OTPVerification;
