"use client";
import CustomButton from "@/components/custom-button";
import { FormInput, FormSelect } from "@/components/form-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  updateBankDetails,
  verifyAccountName,
} from "@/server-actions/settings";
import { Building, CircleUserRound, CreditCard, Lock } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function Bank({ bankList }: { bankList: any }) {
  const [settings, setSettings] = useState({
    bank: "",
    accountNumber: "",
    accountName: "",
    currentPassword: "",
  });
  const [_, startTransition] = useTransition();

  useEffect(() => {
    if (settings.accountNumber.length == 10) {
      startTransition(async () => {
        const response = await verifyAccountName(
          settings.accountNumber,
          settings.bank,
        );
        if (response.success) {
          startTransition(() => {
            setSettings((prev) => ({ ...prev, accountName: response.data! }));
          });
        }
      });
    }
  }, [settings.accountNumber, settings.bank]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof settings, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const response = await updateBankDetails(
        settings.accountNumber,
        settings.bank,
        settings.currentPassword,
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
    });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
          Account Settings
        </h3>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormInput
            id="accountNumber"
            label="Account Number"
            type="text"
            onChange={handleChange}
            // Name attribute matches state key
            value={settings.accountNumber}
            icon={<CreditCard className="h-5 w-5" />}
            placeholder="Enter your account number"
          />
          <FormSelect
            label="Bank Name"
            name="bank"
            // Name attribute matches state key
            value={settings.bank}
            onChange={(value) => handleSelectChange("bank", value)}
            icon={<Building className="h-5 w-5" />}
            options={bankList.map((bank: any) => ({
              label: bank.name,
              value: bank.code,
            }))}
          />
          <FormInput
            id="accountName"
            label="Account Name"
            type="text"
            defaultValue={settings.accountName}
            icon={<CircleUserRound className="h-5 w-5" />}
            readOnly
            placeholder="Account Name"
          />
          <FormInput
            id="currentPassword"
            label="Password"
            type="password"
            defaultValue={settings.currentPassword}
            onChange={handleChange}
            icon={<Lock className="h-5 w-5" />}
            placeholder="Enter password to authorize"
          />
          <CustomButton size="sm">Update Account</CustomButton>
        </form>
      </CardContent>
    </Card>
  );
}
