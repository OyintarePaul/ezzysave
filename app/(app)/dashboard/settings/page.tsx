import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "./Avatar";
import {
  Building2,
  ChevronRight,
  LogOut,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import PageLayout from "../components/page-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

const menuItems = [
  {
    href: "profile",
    label: "Personal Information",
    icon: <UserCircle className="w-5 h-5" />,
    color: "bg-blue-500",
    sub: "Name, email, and phone",
  },
  {
    href: "bank",
    label: "Bank Details",
    icon: <Building2 className="w-5 h-5" />,
    color: "bg-emerald-500",
    sub: "Withdrawal accounts",
  },
  {
    href: "security",
    label: "Security & PIN",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "bg-indigo-500",
    sub: "Protection & withdrawal security",
  },
  {
    href: "signout",
    label: "Sign Out",
    icon: <LogOut className="w-5 h-5" />,
    color: "bg-red-500",
    sub: "Securely exit your account",
  },
];

const SettingsPage = async () => {
  return (
    <PageLayout
      title="Settings"
      subtitle="Manage your personal information, bank details, security settings, and more."
    >
      <UserAvatar />

      <Card>
        <CardContent>
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={`/dashboard/settings/${item.href}`}
              className={`w-full flex items-center justify-between py-5 transition-all group ${
                index !== menuItems.length - 1
                  ? "border-b dark:border-gray-800"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`${item.color} p-2.5 rounded-2xl text-white shadow-lg`}
                >
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black">{item.label}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {item.sub}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default SettingsPage;
