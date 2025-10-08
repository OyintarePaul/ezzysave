import Transactions from "@/components/transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { pageAuthGuard } from "@/lib/auth";
import { Plus } from "lucide-react";

const balances = [
  { label: "Daily Savings", amount: "$15,000" },
  { label: "Fixed Deposit", amount: "$5,000" },
  { label: "Target Saving", amount: "$5,000" },
  { label: "Unallocated balance", amount: "$5,000" },
];

export default async function DashboardHome() {
  pageAuthGuard("/dashboard");
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-4 rounded-lg grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* top stat cards */}
        {balances.map((balance, index) => (
          <Card key={index} className="flex-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span>{balance.label}</span>
                <Button variant="ghost" size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{balance.amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Transactions />
    </div>
  );
}
