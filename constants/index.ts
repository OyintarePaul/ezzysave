import { CircleDollarSign, CreditCard, LayoutDashboard, LogOut, PiggyBank, Settings } from "lucide-react";

export const menuItems = [
  { name: "Home", href: "/dashboard", Icon: LayoutDashboard },
  { name: "Savings", href: "/dashboard/savings", Icon: PiggyBank },    
  { name: "Loans", href: "/dashboard/loans", Icon: CreditCard},
  { name: "Transactions", href: "/dashboard/transactions", Icon: CircleDollarSign },
  { name: "Settings", href: "/dashboard/settings", Icon: Settings,  },
];