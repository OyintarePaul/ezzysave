"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import { updatePinAction } from "@/server-actions/settings";
import { Lock } from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    newPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must be numeric"),
    confirmPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must be numeric"),
  })
  .refine((data: any) => data.newPin === data.confirmPin, {
    message: "New PIN and Confirm PIN must match",
  });

export default function UpdatePinForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: "",
      newPin: "",
      confirmPin: "",
    },
    resolver: zodResolver(formSchema),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const response = await updatePinAction({
        pin: values.newPin,
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
