import { DollarSign } from "lucide-react";
import Link from "next/link";
import { Progress } from "./ui/progress";
import { progressBarColor } from "@/lib/utils";

export default function SavingsList() {
  const plans = [
    {
      id: "1",
      name: "Vacation Fund",
      savedAmount: "$1,200",
      targetAmount: "$5,000",
      type: "target",
      interestEarned: "$50",
      progress: 24,
      createdDate: "Jan 15, 2024",
      description: "Summer vacation to Europe",
      monthlyContribution: "$400",
      contributions: [
        { date: "Oct 1", amount: "$400" },
        { date: "Sep 1", amount: "$400" },
        { date: "Aug 1", amount: "$400" },
      ],
    },
    {
      id: "2",
      name: "Emergency Fund",
      savedAmount: "$3,500",
      targetAmount: "$10,000",
      type: "fixed",
      interestEarned: "$120",
      progress: 35,
      createdDate: "Dec 1, 2023",
      description: "6 months of living expenses",
      monthlyContribution: "$500",
      contributions: [
        { date: "Oct 1", amount: "$500" },
        { date: "Sep 1", amount: "$500" },
        { date: "Aug 1", amount: "$500" },
      ],
    },
    {
      id: "3",
      name: "New Car",
      savedAmount: "$7,800",
      targetAmount: "$25,000",
      type: "daily",
      interestEarned: "$300",
      progress: 31,
      createdDate: "Feb 10, 2024",
      description: "Tesla Model 3",
      monthlyContribution: "$600",
      contributions: [
        { date: "Oct 15", amount: "$600" },
        { date: "Sep 15", amount: "$600" },
        { date: "Aug 15", amount: "$600" },
      ],
    },
  ];

  const typeColors: {
    [key: string]: string;
  } = {
    target: "bg-blue-500/10 text-blue-400 border-blue-400",
    fixed: "bg-purple-500/10 text-purple-400 border-purple-400",
    daily: "bg-green-500/10 text-green-400 border-green-400",
  };

  const typeIconColors: {
    [key: string]: string;
  } = {
    target: "text-blue-400",
    fixed: "text-purple-400",
    daily: "text-green-400",
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Savings Plans</h1>
        <p className="text-muted-foreground">Click on a plan to view details</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plans.map((plan) => (
          <Link
            href={`/dashboard/savings/${plan.id}`}
            key={plan.id}
            className="border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${typeColors[plan.type]}`}>
                  <DollarSign
                    className={`size-6 ${typeIconColors[plan.type]}`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  typeColors[plan.type]
                }`}
              >
                {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{plan.savedAmount}</p>
                <p className="text-sm text-muted-foreground">
                  of {plan.targetAmount}
                </p>
              </div>

              <Progress
                value={plan.progress}
                className={`w-32 [&>div]:${
                  plan.type == "target"
                    ? "bg-blue-500"
                    : plan.type == "fixed"
                    ? "bg-purple-500"
                    : "bg-green-500"
                }`}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
