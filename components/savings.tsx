import { Card, CardContent } from "./ui/card";
import {
  Table,
  TableBody,

  TableCell,

  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CircleDollarSign } from "lucide-react";

const savingPlans = [
  { name: "Vacation Fund", savedAmount: "$1,200", type: "target", interestEarned: "$50" },
  { name: "Emergency Fund", savedAmount: "$3,500", type: "fixed", interestEarned: "$120" },
  { name: "New Car", savedAmount: "$7,800", type: "daily", interestEarned: "$300" },
  { name: "Home Down Payment", savedAmount: "$15,000", type: "target", interestEarned: "$600" },
  { name: "Retirement", savedAmount: "$25,000", type: "fixed", interestEarned: "$1,200" },
  { name: "Gadget Upgrade", savedAmount: "$2,300", type: "daily",  interestEarned: "$90" },
  { name: "Vacation Fund", savedAmount: "$1,200", type: "target", interestEarned: "$50" },
  { name: "Emergency Fund", savedAmount: "$3,500", type: "fixed", interestEarned: "$120" },
  { name: "New Car", savedAmount: "$7,800", type: "daily", interestEarned: "$300" },
  { name: "Home Down Payment", savedAmount: "$15,000", type: "target", interestEarned: "$600" },
  { name: "Retirement", savedAmount: "$25,000", type: "fixed", interestEarned: "$1,200" },
  { name: "Gadget Upgrade", savedAmount: "$2,300", type: "daily",  interestEarned: "$90" },

];

export default function SavingsList() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Interest Earned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savingPlans.map(({name, savedAmount, type, interestEarned }, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                    <CircleDollarSign className="size-5 text-purple-500" />
                </TableCell>
                <TableCell className="text-md font-bold">{name}</TableCell>
                <TableCell className="capitalize">{type}</TableCell>
                <TableCell>
                  {savedAmount}
                </TableCell>
                <TableCell>{interestEarned}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          
        </Table>
      </CardContent>
    </Card>
  );
}
