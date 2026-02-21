import { TrendingUp } from "lucide-react";
import Link from "next/link";
import RegisterForm from "./register-form";

const RegisterPage = () => {
  return (
    <>
      {/* Header Section */}
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

      {/* Register Form */}
      <RegisterForm />

      <div className="mt-6 text-center text-sm space-y-2">
        <p className="text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary">
            Log in here
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
