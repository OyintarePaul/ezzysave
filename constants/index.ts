import { NavItem } from "@/types";
import { House, CreditCard, DollarSign, User, PiggyBank } from "lucide-react";

export const navItems: NavItem[] = [
  { id: 1, name: "Overview", icon: House, path: "/dashboard/overview" },
  { id: 2, name: "Savings Plans", icon: PiggyBank, path: "/dashboard/savings" },
  { id: 3, name: "Transactions", icon: DollarSign, path: "/dashboard/transactions" },
  { id: 4, name: "Loans", icon: CreditCard, path: "/dashboard/loans" },
  { id: 5, name: "Profile", icon: User, path: "/dashboard/profile" },
];

export const typeColors: {
  [key: string]: string;
} = {
  target: "bg-blue-500/10 text-blue-400 border-blue-400",
  fixed: "bg-purple-500/10 text-purple-400 border-purple-400",
  daily: "bg-green-500/10 text-green-400 border-green-400",
};

export const typeIconColors: {
  [key: string]: string;
} = {
  target: "text-blue-400",
  fixed: "text-purple-400",
  daily: "text-green-400",
};
