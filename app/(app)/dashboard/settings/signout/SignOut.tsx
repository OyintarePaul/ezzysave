import CustomButton from "@/components/custom-button";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function SignOut() {
  const { signOut } = useClerk();
  return (
    <div className="space-y-3">
      <CustomButton
        variant="destructive"
        className="w-full"
        onClick={() => signOut()}
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
