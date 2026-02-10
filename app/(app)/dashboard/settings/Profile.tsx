"use client";
import { FormInput } from "@/components/form-input";
import { Mail, Phone, User } from "lucide-react";
import CustomButton from "@/components/custom-button";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProfilePageUIProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
}

export default function Profile({
  firstName,
  lastName,
  email,
  phoneNumber,
}: ProfilePageUIProps) {
  const [profile, setProfile] = useState({
    firstName,
    lastName,
    email,
    phoneNumber,
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
          Personal Information
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            id="firstName"
            label="First Name"
            type="text"
            value={profile.firstName}
            onChange={handleChange}
            icon={<User className="h-5 w-5" />}
          />
          <FormInput
            id="lastName"
            label="Last Name"
            type="text"
            value={profile.lastName}
            onChange={handleChange}
            icon={<User className="h-5 w-5" />}
          />
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={handleChange}
            readOnly
            icon={<Mail className="h-5 w-5" />}
          />
          <FormInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={profile.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            icon={<Phone className="h-5 w-5" />}
          />
        </div>
        <CustomButton type="button" size="sm">
          {isPending ? "Saving..." : "Update Profile"}
        </CustomButton>
      </CardContent>
    </Card>
  );
}
