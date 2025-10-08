import SavingsList from "@/components/savings";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth0, pageAuthGuard } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

async function SavingsPage() {
  await pageAuthGuard("/dashboard/savings");

  return (
    <div className="flex flex-col gap-2">
      <Card className="bg-purple-500 text-white bg-[url('/money-bag.png')] bg-no-repeat bg-[length:200px] bg-[position:right_2rem_bottom_1rem]">
        <CardContent>
          <div className="space-y-4 p-4">
            <h2 className="text-3xl font-bold">Your Savings</h2>
            <p className="text-lg">All your saving plans are shown here</p>
            <Link
              href="/dashboard/savings/new"
              className={cn(
                buttonVariants(),
                "bg-white text-purple-500 hover:bg-purple-100 px-8"
              )}
            >
              Create New Plan
            </Link>
          </div>
        </CardContent>
      </Card>

      <SavingsList />
    </div>
  );
}

export default auth0.withPageAuthRequired(SavingsPage, {
  returnTo: "/dashboard/savings",
});
