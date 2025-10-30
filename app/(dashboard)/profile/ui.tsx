"use client";
import React, { useState } from "react";
import { FormInput } from "../components/form-input";
import { Lock, Mail, Phone, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

function ProfilePageUI() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Stephen",
    email: "john.stephen@example.com",
    phoneNumber: "+1234567890",
    bio: "Financial enthusiast saving for a rainy day. Love using EzzySave to manage my goals!",
    notifications: {
      email: true,
      sms: false,
    },
    currentPin: "",
    newPin: "",
    confirmPin: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // const handleCheckboxChange = (name: string, checked: boolean) => {
  //   // The 'id' from the checkbox is used as the key name (e.g., 'email', 'sms')
  //   setProfile((prev) => ({
  //     ...prev,
  //     notifications: {
  //       ...prev.notifications,
  //       [name]: checked,
  //     },
  //   }));
  // };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      console.log("Profile Saved:", profile);
      // In a real app, you'd show a success toast and maybe
      // update a global user context.
    }, 1500);
  };

  return (
    // Added max-width and centering for better readability on large screens
    <div className="p-4 sm:p-8 space-y-8 pb-20 lg:pb-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Profile Settings
      </h1>

      <form onSubmit={handleSave} className="space-y-10">
        {/* User Avatar and Name Section */}
        <div className="flex flex-col md:flex-row items-center space-x-4 p-6 bg-white rounded-xl shadow-lg border">
          <Avatar className="h-16 w-16 font-bold text-2xl">
            <AvatarFallback className="bg-primary/20 text-primary">
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl text-center md:text-left font-semibold text-gray-900 dark:text-white">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-center md:text-left text-gray-500 dark:text-gray-400">
              {profile.email}
            </p>
          </div>
          <Label
            htmlFor="change-image"
            className={`md:ml-auto text-sm font-medium whitespace-nowrap ${buttonVariants(
              { variant: "link" }
            )}`}
          >
            Change Photo
          </Label>
          <input // Hidden file input for changing avatar
            type="file"
            id="change-image"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // In a real app, you'd upload the image and update the avatar URL
                console.log("Selected file:", file);
              }
            }}
          />
        </div>

        {/* Personal Information Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
            Personal Information
          </h3>
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
              icon={<Mail className="h-5 w-5" />}
            />
            <FormInput
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              value={profile.phoneNumber}
              onChange={handleChange}
              icon={<Phone className="h-5 w-5" />}
            />
          </div>
          <FormInput
            id="bio"
            label="About Me"
            as="textarea"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us a little about yourself..."
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
            Withdrawal Pin Settings
          </h3>
          <div className="space-y-4">
            <FormInput
              id="currentPin"
              label="Current Password"
              type="password"
              onChange={handleChange}
              // Name attribute matches state key
              value={profile.currentPin}
              icon={<Lock className="h-5 w-5" />}
              placeholder="Enter your account password"
            />
            <FormInput
              id="newPin"
              label="New 4-Digit Pin"
              type="password" // Use "password" to hide PIN
              // Name attribute matches state key
              value={profile.newPin}
              onChange={handleChange}
              icon={<Lock className="h-5 w-5" />}
              placeholder="****"
            />
            <FormInput
              id="confirmPin"
              label="Confirm New Pin"
              type="password"
              value={profile.confirmPin}
              onChange={handleChange}
              icon={<Lock className="h-5 w-5" />}
              placeholder="****"
            />
          </div>
        </div>

        {/* Notification Settings Card */}
        {/* <div className="bg-white p-6 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <FormCheckbox
              id="email-notifications" // Using a more specific ID
              name="email" // This name maps to the state key
              label="Email Notifications"
              description="Receive updates about your account and savings progress via email."
              checked={profile.notifications.email}
              onChange={handleCheckboxChange}
            />
            <FormCheckbox
              id="sms-notifications" // Using a more specific ID
              name="sms" // This name maps to the state key
              label="SMS Notifications"
              description="Get important alerts and reminders sent to your mobile phone."
              checked={profile.notifications.sms}
              onChange={handleCheckboxChange}
            />
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
          <Button
            variant="secondary"
            size="lg"
            type="button"
            className="rounded-lg text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            className="rounded-lg text-sm"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePageUI;
