"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AvatarImage } from "@radix-ui/react-avatar";
import ChangeAvatar from "./ChangeAvatar";
import { useUser } from "@clerk/nextjs";

export default function UserAvatar() {
  const { user } = useUser();

  return (
    <div className="flex flex-col md:flex-row items-center space-x-4 p-6 bg-white rounded-xl shadow-lg border">
      <Avatar className="h-16 w-16 font-bold text-2xl">
        <AvatarImage src={user?.imageUrl || ""} />
        <AvatarFallback className="bg-primary/20 text-primary">
          {user?.firstName?.charAt(0) || "U"}
          {user?.lastName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl text-center md:text-left font-semibold text-gray-900 dark:text-white">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-sm text-center md:text-left text-gray-500 dark:text-gray-400">
          {user?.emailAddresses[0]?.emailAddress}
        </p>
      </div>
      <Label
        htmlFor="change-image"
        className={`md:ml-auto text-sm font-medium whitespace-nowrap ${buttonVariants(
          { variant: "link" },
        )}`}
      >
        Change Photo
      </Label>
      <ChangeAvatar />
    </div>
  );
}
