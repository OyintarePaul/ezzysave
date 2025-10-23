import TransactionsTable from "@/components/transactions";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pageAuthGuard } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function TransactionsPage() {
  await pageAuthGuard("/dashboard/transactions");

  return (
    <div className="flex flex-col gap-2">
      <Card className="bg-pink-500 text-white bg-[url('/money-bag.png')] bg-no-repeat bg-[length:200px] bg-[position:right_2rem_bottom_1rem]">
        <CardContent>
          <div className="space-y-4 p-4">
            <h2 className="text-3xl font-bold">Transaction History</h2>
            <p className="text-lg">
              All your transactions in one place. Track your loan applications,
              repayments, and account activity easily.
            </p>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants(),
                "bg-white text-pink-500 hover:bg-green-100 px-8"
              )}
            >
              Go to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* main content below will be changed later  */}
      <TransactionsTable />
    </div>
  );
}
