"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import { updatePinAction } from "@/server-actions/settings";
import { Lock } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";
import {
  PinUpdateData,
  pinUpdateFormSchema,
} from "@/lib/schema/pin-update-form";

export default function UpdatePinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PinUpdateData>({
    defaultValues: {
      password: "",
      newPin: "",
      confirmPin: "",
    },
    resolver: zodResolver(pinUpdateFormSchema),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: PinUpdateData) => {
    startTransition(async () => {
      const response = await updatePinAction({
        newPin: values.newPin,
        confirmPin: values.confirmPin,
        password: values.password,
      });

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
    });
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
      <CustomButton size="sm" disabled={isPending}>
        {isPending ? "Updating..." : "Update Pin"}
      </CustomButton>
    </form>
  );
}
