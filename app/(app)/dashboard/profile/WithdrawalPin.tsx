"use client";
import CustomButton from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { updatePinAction } from "@/server-actions/settings";
import { Lock } from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function WithdrawalPin() {
  const [pin, setPin] = useState({
    password: "",
    newPin: "",
    confirmPin: "",
  });

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const response = await updatePinAction({
        pin: pin.newPin,
        confirmPin: pin.confirmPin,
        password: pin.password,
      });

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
      startTransition(() => {
        setPin({
          password: "",
          newPin: "",
          confirmPin: "",
        });
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
          Withdrawal Pin Settings
        </h3>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormInput
            id="password"
            label="Current Password"
            type="password"
            onChange={handleChange}
            // Name attribute matches state key
            value={pin.password}
            icon={<Lock className="h-5 w-5" />}
            placeholder="Enter your account password"
          />
          <FormInput
            id="newPin"
            label="New 4-Digit Pin"
            type="password" // Use "password" to hide PIN
            // Name attribute matches state key
            value={pin.newPin}
            onChange={handleChange}
            icon={<Lock className="h-5 w-5" />}
            placeholder="****"
            maxLength={4}
          />
          <FormInput
            id="confirmPin"
            label="Confirm New Pin"
            type="password"
            value={pin.confirmPin}
            onChange={handleChange}
            icon={<Lock className="h-5 w-5" />}
            placeholder="****"
            maxLength={4}
          />
          <CustomButton
            size="sm"
            disabled={
              isPending ||
              pin.newPin.length != 4 ||
              pin.newPin != pin.confirmPin
            }
          >
            {isPending ? "Updating..." : "Update Pin"}
          </CustomButton>
        </form>
      </CardContent>
    </Card>
  );
}
