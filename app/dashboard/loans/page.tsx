import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pageAuthGuard } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HandCoins } from "lucide-react";

export default async function LoansPage() {
  pageAuthGuard("/dashboard/loans");
  return (
    <div className="flex flex-col gap-2">
      <Card className="bg-green-500 text-white bg-[url('/money-bag.png')] bg-no-repeat bg-[length:200px] bg-[position:right_2rem_bottom_1rem]">
        <CardContent>
          <div className="space-y-4 p-4">
            <h2 className="text-3xl font-bold">Active and Pending Loans</h2>
            <p className="text-lg">
              All your active and pending loans can be accessed here
            </p>
            <Link
              href="/dashboard/loans/new"
              className={cn(
                buttonVariants(),
                "bg-white text-green-500 hover:bg-green-100 px-8"
              )}
            >
              Apply for a Loan
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* main content below will be changed later  */}
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HandCoins className="size-8" />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle>No Loans</EmptyTitle>
        <EmptyDescription>
          Looks like you don&apos;t have any pending or active loans
        </EmptyDescription>
        <EmptyContent>
          <Link href="/dashboard/loans/new" className={buttonVariants()}>
            Apply for a Loan
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
