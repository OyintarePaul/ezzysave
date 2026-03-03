"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import { updatePinAction } from "@/server-actions/settings";
import { Lock } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  PinUpdateData,
  pinUpdateFormSchema,
} from "@/lib/schema/pin-update-form";
import { useReverification, useUser } from "@clerk/nextjs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function UpdatePinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<PinUpdateData>({
    defaultValues: {
      password: "",
      newPin: "",
      confirmPin: "",
    },
    resolver: zodResolver(pinUpdateFormSchema),
  });
  const [otpCode, setOtpCode] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const { user, isLoaded, isSignedIn } = useUser();
  const [resendTimer, setResendTimer] = useState(0);

  // Handle the countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const triggerOtp = async () => {
    // 1. Basic checks
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const primaryEmail = user.primaryEmailAddress;

    // 2. TypeScript fix: Check if primaryEmailAddress exists
    if (!primaryEmail) {
      toast.error("No primary email address found for this account.");
      return;
    }

    // 3. Trigger the verification
    startTransition(async () => {
      try {
        
        await primaryEmail.prepareVerification({
          strategy: "email_code",
        });
        setResendTimer(60);
        setIsOpen(true);
        toast.success("Verification code sent to your email.");
      } catch (err: unknown) {
        // 4. Handle Clerk-specific errors
        if (isClerkAPIResponseError(err)) {
          toast.error(err.errors[0].longMessage || "Failed to send OTP.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    });
  };

  const handlePinUpdate = async () => {
    const { newPin, confirmPin, password } = getValues();
    const response = await updatePinAction({
      newPin,
      confirmPin,
      password,
    });

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    reset();
    setOtpCode("");
    setIsOpen(false);
  };

  const verifyAndSavePin = async () => {
    // 1. Basic checks
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const primaryEmail = user.primaryEmailAddress;

    // 2. Check if primaryEmailAddress exists
    if (!primaryEmail) {
      toast.error("No primary email address found for this account.");
      return;
    }

    // 3. Trigger the verification and saving process
    startTransition(async () => {
      try {
        // Step A: Verify the OTP code on the client
        // 'otpCode' is your state variable for the input field
        const result = await primaryEmail.attemptVerification({
          code: otpCode,
        });

        if (result.verification.status === "verified") {
          // Step B: Call the Server Action to update the PIN
          toast.success("OTP verified! Updating your PIN...");
          await handlePinUpdate();
        }
      } catch (err: unknown) {
        // 4. Handle Clerk-specific errors (Invalid OTP, expired, etc.)
        if (isClerkAPIResponseError(err)) {
          const isAlreadyVerified =
            err?.errors?.[0]?.code === "verification_already_verified";
          if (isAlreadyVerified) {
            // "Error" Success: Proceed anyway because the identity is confirmed
            toast.success(
              "OTP already verified. Proceeding with PIN update...",
            );

            await handlePinUpdate();
          } else {
            // Real Error: Wrong code, expired code, etc.
            toast.error(err?.errors?.[0]?.longMessage || "Verification failed");
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    });
  };

  const onSubmit = () => {
    triggerOtp();
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    setOtpCode("");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        {...register("password")}
        label="Current Password"
        type="password"
        autoComplete="new-password" // hack to disable brower autofill password
        icon={<Lock className="h-5 w-5" />}
        placeholder="Enter your account password"
        error={errors.password?.message}
      />
      <FormInput
        {...register("newPin")}
        label="New 4-Digit Pin"
        type="password"
        icon={<Lock className="h-5 w-5" />}
        placeholder="****"
        maxLength={4}
        error={errors.newPin?.message}
      />
      <FormInput
        {...register("confirmPin")}
        label="Confirm New Pin"
        type="password"
        icon={<Lock className="h-5 w-5" />}
        placeholder="****"
        maxLength={4}
        error={errors.confirmPin?.message}
      />
      <CustomButton isPending={isPending}>
        Proceed to Verify Identity
      </CustomButton>

      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl">Verify Your Identity</DialogTitle>
            <DialogDescription className="mb-6 ">
              Please enter the 6-digit code sent to your email address.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full flex flex-col items-center space-y-6">
            <InputOTP
              autoFocus
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              pattern={REGEXP_ONLY_DIGITS}
              containerClassName="group flex items-center justify-center"
            >
              <InputOTPGroup className="gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    index={index}
                    key={index}
                    className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black bg-gray-50 dark:bg-gray-900 border-2 border-transparent !rounded-xl dark:text-white focus-within:ring-2 focus-within:ring-primary"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <CustomButton
              type="button"
              isPending={isPending}
              disabled={otpCode.length !== 6}
              onClick={verifyAndSavePin}
            >
              Verify & Update PIN
            </CustomButton>

            <CustomButton
              variant="link"
              type="button"
              disabled={resendTimer > 0 || isPending}
              onClick={triggerOtp} // Reuses your triggerOtp function
            >
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Didn't get a code? Resend"}
            </CustomButton>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
