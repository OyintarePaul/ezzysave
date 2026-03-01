"use client";
import { useTransition } from "react";
import { FormInput } from "@/components/form-input";
import { Mail, Lock } from "lucide-react";
import CustomButton from "@/components/custom-button";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormData, loginFormSchema } from "@/lib/schema/login-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });
  const [isPending, startTransition] = useTransition();
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const onSubmit = ({ email, password }: LoginFormData) => {
    startTransition(async () => {
      if (!isLoaded) return;
      try {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          toast.success("Login was successful. Redirecting ...");
          const redirectUrl =
            searchParams.get("returnTo") || "/dashboard/overview";
          router.replace(redirectUrl);
        } else if (result.status == "needs_second_factor") {
          await prepareMFA();
          router.push("/auth/login/second-factor");
        } else {
          console.log(result.status);
          toast.error("Login failed. Please try again.");
        }
      } catch (err) {
        console.log(err);
        toast.error("Login failed. Please, try again");
      }
    });
  };

  const prepareMFA = async () => {
    if (!isLoaded) return;
    if (!signIn.supportedFirstFactors) return;
    // Find the factor the user has enabled (usually 'email_code' or 'phone_code')
    const factor = signIn.supportedFirstFactors.find(
      (f) => f.strategy === "email_code",
    );

    if (factor) {
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: factor.emailAddressId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Input */}
      <FormInput
        {...register("email")}
        label="Email Address"
        type="email"
        icon={<Mail />}
        placeholder="you@example.com"
        error={errors.email?.message || ""}
      />

      {/* Password Input */}
      <FormInput
        {...register("password")}
        label="Password"
        type="password"
        icon={<Lock />}
        placeholder="••••••••"
        error={errors.password?.message}
      />

      {/* Clerk's CAPTCHA widget */}
      <div id="clerk-captcha" />

      {/* Action Button */}
      <CustomButton
        type="submit"
        isPending={isPending}
        className="w-full text-base tracking-wide mt-8"
      >
        Login
      </CustomButton>
    </form>
  );
};

export default LoginForm;
