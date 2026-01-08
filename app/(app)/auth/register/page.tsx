"use client";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { FormInput } from "@/components/form-input";
import {
  TrendingUp,
  Mail,
  Lock,
  AlertCircle,
  User,
  UserPlus,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import CustomButton from "@/components/custom-button";
import Link from "next/link";
import OTPVerification from "./otp";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { signUp, isLoaded } = useSignUp();

  if (!isLoaded) {
    // Handle loading state
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    // Simulate API call for registration
    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setError("Registration failed. Please try again.");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
        {pendingVerification && <OTPVerification email={email} />}

        {!pendingVerification && (
          <>
            <div className="text-center space-y-3 mb-8">
              <div className="flex justify-center items-center text-primary">
                <TrendingUp className="h-10 w-10 stroke-[1.5]" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Join EzzySave Today
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Create your account to start managing your finances.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="firstName"
                  label="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  icon={<User />}
                  placeholder="John"
                  error={error && !firstName ? "First name is required." : null}
                />
                <FormInput
                  id="lastName"
                  label="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  icon={<User />}
                  placeholder="Doe"
                  error={error && !lastName ? "Last name is required." : null}
                />
              </div>

              <FormInput
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail />}
                placeholder="you@example.com"
                error={
                  error && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? "Please enter a valid email."
                    : null
                }
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock />}
                placeholder="••••••••"
                minLength={8}
                error={
                  error && password.length < 8
                    ? "Password must be at least 8 characters."
                    : null
                }
              />

              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock />}
                placeholder="••••••••"
                minLength={8}
                error={
                  error && password !== confirmPassword
                    ? "Passwords do not match."
                    : null
                }
              />
              
              {/* Clerk's CAPTCHA widget */}
              <div id="clerk-captcha" />

              {error && !successMessage && (
                <div
                  className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300 flex items-center space-x-2"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div
                  className="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300 flex items-center space-x-2"
                  role="alert"
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

              <CustomButton
                type="submit"
                disabled={isLoading}
                className="w-full text-base tracking-wide mt-8"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Register Account</span>
                  </>
                )}
              </CustomButton>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-sm space-y-2">
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login" // Replace with your login page path
              className="font-medium text-primary"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
