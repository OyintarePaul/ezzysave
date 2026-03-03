"use client";

import { useUser } from "@clerk/nextjs";
import {
  Mail,
  Phone,
  User,
  CheckCircle2,
  ShieldCheck,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileDisplay() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Skeleton className="h-[400px] w-full max-w-2xl mx-auto rounded-xl" />
    );
  }

  const primaryEmail = user?.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  );
  const isEmailVerified = primaryEmail?.verification.status === "verified";
  const primaryPhone = user?.phoneNumbers[0]?.phoneNumber || "Not provided";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Personal Identity
              </CardTitle>
              <CardDescription>
                Your verified account information for secure withdrawals.
              </CardDescription>
            </div>
            <Badge
              variant={isEmailVerified ? "secondary" : "outline"}
              className="h-fit"
            >
              {isEmailVerified ? "Active Account" : "Action Required"}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          {/* First Name */}
          <ProfileItem
            label="First Name"
            value={user?.firstName}
            icon={<User className="h-4 w-4" />}
          />

          {/* Last Name */}
          <ProfileItem
            label="Last Name"
            value={user?.lastName}
            icon={<User className="h-4 w-4" />}
          />

          {/* Email Address with Tooltip */}
          <ProfileItem
            label="Email Address"
            value={primaryEmail?.emailAddress}
            icon={<Mail className="h-4 w-4" />}
            status={
              isEmailVerified ? (
                <VerifiedTooltip message="This email is verified." />
              ) : null
            }
          />

          {/* Phone Number */}
          <ProfileItem
            label="Phone Number"
            value={primaryPhone}
            icon={<Phone className="h-4 w-4" />}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Sub-component for clean layout
 */
function ProfileItem({
  label,
  value,
  icon,
  status,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
  status?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-tight">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground truncate">
          {value || "—"}
        </span>
        {status}
      </div>
    </div>
  );
}

/**
 * Shadcn Tooltip for Verification
 */
function VerifiedTooltip({ message }: { message: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CheckCircle2 className="h-4 w-4 text-emerald-500 cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="flex items-center gap-2 text-xs font-medium">
            <Info className="h-3 w-3" />
            {message}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
