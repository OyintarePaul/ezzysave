"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const UserProfileDisplay: React.FC = () => {
  const { user } = useUser();
  return (
    <Link href="/dashboard/profile" className="flex items-center space-x-3">
      <Avatar className="size-10">
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback className="bg-primary/10">
          {user?.firstName && user?.firstName[0]}
          {user?.lastName && user?.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="hidden sm:block">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
      </div>
    </Link>
  );
};

export default UserProfileDisplay;
