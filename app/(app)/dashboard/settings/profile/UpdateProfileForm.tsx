"use client";
import CustomButton from "@/components/custom-button";
import { FormInput } from "@/components/form-input";
import { useUser } from "@clerk/nextjs";
import { Mail, Phone, User } from "lucide-react";
import { useTransition } from "react";

export default function UpdateProfileForm() {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  return (
    <div className="space-y-4">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          id="firstName"
          label="First Name"
          icon={<User className="h-5 w-5" />}
        />
        <FormInput
          id="lastName"
          label="Last Name"
          icon={<User className="h-5 w-5" />}
        />
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          readOnly
          icon={<Mail className="h-5 w-5" />}
        />
        <FormInput
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          readOnly
          placeholder="Enter your phone number"
          icon={<Phone className="h-5 w-5" />}
        />
      </form>
      <CustomButton type="button" isPending={isPending}>
        Update Profile
      </CustomButton>
    </div>
  );
}
