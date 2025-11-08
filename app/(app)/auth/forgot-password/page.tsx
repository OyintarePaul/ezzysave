"use client";
import CustomButton from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import { Spinner } from "@/components/ui/spinner";
import { useSignIn } from "@clerk/nextjs";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Lock,
  Mail,
  RefreshCw,
  Send,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { isLoaded, signIn } = useSignIn();

  if (!isLoaded) return null;

  const handleRequestCode = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // --- Mock API Call Simulation: Request Code ---
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setStep(2); // Move to verification step
      setError("");
    } catch (err) {
      // Error handling in a real app would use the caught error object
      console.log(err);
      setError(
        "Failed to send reset code. Please verify the email and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!code || !newPassword) {
      setError("Please enter both the code and your new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    // --- Mock API Call Simulation: Verify Code & Set Password ---
    try {
      console.log(code, newPassword);
      const response = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code,
        password: newPassword,
      });

      console.log(response.status);

      if (response.status !== "complete") {
        throw new Error("Password reset not completed.");
      }

      setStep(3); // Move to success state
    } catch (err) {
      console.log(err);
      setError(
        "Verification failed. The code may be invalid or expired. Try requesting a new code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Reset Your Password",
          description:
            "Enter the email address associated with your account, and we'll send you a verification code.",
          form: (
            <form onSubmit={handleRequestCode} className="space-y-6">
              <FormInput
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail />}
                placeholder="you@example.com"
                error={error && !email ? "Email is required." : null}
              />

              {/* Global Error Display */}
              {error && email && (
                <div
                  className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300 flex items-center space-x-2"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <CustomButton
                type="submit"
                disabled={isLoading}
                className="w-full text-base tracking-wide mt-8"
              >
                {isLoading ? (
                  <>
                    <Spinner /> Sending code...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" /> Send Verification Code
                  </>
                )}
              </CustomButton>
            </form>
          ),
          footerLink: "Wait, I remember my password. Take me back to login.",
          showBackButton: false,
        };

      case 2:
        return {
          title: "Verify & Set New Password",
          description: `We sent a code to ${email}. Enter the code and your new desired password below.`,
          form: (
            <form onSubmit={handleVerifyAndSetPassword} className="space-y-6">
              <FormInput
                id="code"
                label="Verification Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                icon={<Lock />}
                placeholder="e.g., 123456"
                error={
                  error && !code && error
                    ? "Verification code is required."
                    : null
                }
                className="col-span-12"
              />
              <FormInput
                id="new-password"
                label="New Password (min 8 characters)"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock />}
                placeholder="••••••••"
                error={
                  error && !newPassword && error
                    ? "New password is required."
                    : null
                }
                className="col-span-12"
              />

              {/* Global Error Display */}
              {error && (
                <div
                  className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300 flex items-center space-x-2"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <CustomButton
                disabled={isLoading}
                className="w-full text-base tracking-wide mt-8"
              >
                {isLoading ? (
                  <>
                    <Spinner /> Resetting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" /> Reset Password
                  </>
                )}
              </CustomButton>
            </form>
          ),
          footerLink: "Didn't receive the code? Go back to change the email.",
          showBackButton: true,
        };

      case 3:
        return {
          title: "Password Successfully Reset!",
          description:
            "Your password has been successfully updated. You can now log in to your account with your new credentials.",
          form: (
            <div className="space-y-6 pt-4">
              <div className="p-4 text-center bg-green-100 rounded-xl dark:bg-green-900/30">
                <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <p className="text-green-800 dark:text-green-400 font-medium">
                  Your password is now updated.
                </p>
              </div>
              <CustomButton className="w-full" variant="secondary" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="h-5 w-5" />
                  Go to Login
                </Link>
              </CustomButton>
            </div>
          ),
          footerLink: null,
          showBackButton: false,
        };
      default:
        // Fallback, though ideally we only use steps 1, 2, 3
        return {
          title: "Error",
          description: "An unexpected error occurred.",
          form: null,
          footerLink: null,
          showBackButton: false,
        };
    }
  };

  const { title, description, form, footerLink, showBackButton } =
    getStepContent();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center items-center text-primary">
            <TrendingUp className="h-10 w-10 stroke-[1.5]" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        {/* Main Content (Form or Success Message) */}
        {form}

        {/* Footer Links */}
        {footerLink && (
          <div className="mt-6 text-center text-sm">
            <p>
              <a
                href="/auth/login"
                onClick={(e) => {
                  // Only prevent default navigation if we are in step 2 and want to handle back logic
                  if (step === 2) {
                    e.preventDefault();
                    // handleBackToLogin();
                  }
                }}
                className="font-medium text-primary"
              >
                {footerLink}
              </a>
            </p>
          </div>
        )}

        {/* Back button for Step 2 */}
        {showBackButton && (
          <div className="mt-6">
            <CustomButton
              onClick={() => {
                setStep(1); // Go back to email entry
                setError("");
                setCode("");
                setNewPassword("");
              }}
              className="w-full text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            >
              <ArrowLeft className="h-5 w-5" />
              Change Email Address
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
