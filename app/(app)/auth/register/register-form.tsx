"use client";
import { useSignUp } from "@clerk/nextjs";
import { FormInput } from "@/components/form-input";
import { Mail, Lock, User } from "lucide-react";
import CustomButton from "@/components/custom-button";
import { useForm } from "react-hook-form";
import {
  RegisterFormData,
  registerFormSchema,
} from "@/lib/schema/register-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerFormSchema),
  });
  const { signUp, isLoaded } = useSignUp();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = ({
    email,
    password,
    firstName,
    lastName,
  }: RegisterFormData) => {
    startTransition(async () => {
      console.log("Registeration started");
      if (!isLoaded) {
        return;
      }
      try {
        await signUp.create({
          emailAddress: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        router.replace("/auth/verify-otp");
      } catch (err) {
        console.log(err);
        toast.error("Unable to create your account. Please, try again");
      }
    });
    // Simulate API call for registration
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          {...register("firstName")}
          label="First Name"
          type="text"
          icon={<User />}
          placeholder="John"
          error={errors.firstName?.message}
        />
        <FormInput
          {...register("lastName")}
          label="Last Name"
          type="text"
          icon={<User />}
          placeholder="Doe"
          error={errors.lastName?.message}
        />
      </div>

      <FormInput
        {...register("email")}
        label="Email Address"
        type="email"
        icon={<Mail />}
        placeholder="you@example.com"
        error={errors.email?.message}
      />

      <FormInput
        {...register("password")}
        label="Password"
        type="password"
        icon={<Lock />}
        placeholder="••••••••"
        minLength={8}
        error={errors.password?.message}
      />

      <FormInput
        {...register("confirmPassword")}
        label="Confirm Password"
        type="password"
        icon={<Lock />}
        placeholder="••••••••"
        minLength={8}
        error={errors.confirmPassword?.message}
      />

      {/* Clerk's CAPTCHA widget */}
      <div id="clerk-captcha" />

      <CustomButton
        isPending={isPending}
        className="w-full text-base tracking-wide mt-8"
      >
        Register Account
      </CustomButton>
    </form>
  );
};

export default RegisterForm;
