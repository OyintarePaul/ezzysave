"use client";
import { useState } from "react";
import { FormInput } from "@/components/form-input";
import { TrendingUp, Mail, Lock, AlertCircle, LogIn } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import CustomButton from "@/components/custom-button";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

const LoginUI = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    //perform sign-in
    if (!isLoaded) return;
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Redirect to dashboard or home page after successful login
        const redirectUrl =
          searchParams.get("returnTo") || "/dashboard/overview";
        router.replace(redirectUrl);
      } else {
        console.log(result.status);
        setError("Unexpected sign-in status. Please try again.");
      }
    } catch (err) {
      console.log(err);
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer container for centering and background
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center items-center text-primary">
            {/* Using a Lucide icon for simple branding */}
            <TrendingUp className="h-10 w-10 stroke-[1.5]" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back to EzzySave
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Log in to manage your savings goals and loans.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
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

          {/* Password Input */}
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock />}
            placeholder="••••••••"
            error={error && !password ? "Password is required." : null}
          />

          {/* Clerk's CAPTCHA widget */}
          <div id="clerk-captcha" />

          {/* Global Error Display */}
          {error && email && password && (
            <div
              className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300 flex items-center space-x-2"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <CustomButton
            type="submit"
            disabled={isLoading}
            className="w-full text-base tracking-wide mt-8"
          >
            {isLoading ? (
              <>
                <Spinner /> Logging in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Log In
              </>
            )}
          </CustomButton>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm space-y-2">
          <p>
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary"
            >
              Forgot your password?
            </Link>
          </p>
          {/* NEW Registration Link */}
          <p className="text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginUI;
