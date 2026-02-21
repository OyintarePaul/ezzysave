"use client";
import CustomButton from "@/components/custom-button";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useTransition } from "react";

export default function SignOut() {
  const { signOut } = useClerk();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      signOut();
    });
  };

  return (
    <div className="space-y-3">
      <CustomButton
        variant="destructive"
        className="w-full"
        isPending={isPending}
        onClick={handleSignOut}
      >
        Yes, Log Me Out
      </CustomButton>
      <Link
        href="/dashboard/settings"
        className={buttonVariants({
          variant: "ghost",
          size: "lg",
          className: "w-full text-muted-foreground",
        })}
      >
        Keep Session Active
      </Link>
    </div>
  );
}
