"use client";
import { FormInput } from "@/components/form-input";
import { useUser } from "@clerk/nextjs";
import { Mail, Phone, User } from "lucide-react";

export default function UpdateProfileForm() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return;
  }

  return (
    <div className="space-y-4">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          id="firstName"
          label="First Name"
          icon={<User className="h-5 w-5" />}
          defaultValue={user?.firstName || ""}
        />
        <FormInput
          id="lastName"
          label="Last Name"
          icon={<User className="h-5 w-5" />}
          defaultValue={user?.lastName || ""}
        />
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          readOnly
          icon={<Mail className="h-5 w-5" />}
          defaultValue={
            user?.emailAddresses.find(
              (e) => e.id === user.primaryEmailAddressId,
            )?.emailAddress || ""
          }
        />
        <FormInput
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          readOnly
          placeholder="Enter your phone number"
          icon={<Phone className="h-5 w-5" />}
          defaultValue={user?.phoneNumbers[0]?.phoneNumber || ""}
        />
      </form>
      {/* <CustomButton type="button">Update Profile</CustomButton> */}
    </div>
  );
}
