import { TrendingUp } from "lucide-react";
import Link from "next/link";
import LoginForm from "./login-form";

const LoginPage = () => {
  return (
    <>
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

      <LoginForm />
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
    </>
  );
};

export default LoginPage;
