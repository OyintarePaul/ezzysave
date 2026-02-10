"use client";
import { navItems } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationItem= ({ itemIndex }: {itemIndex: number}) => {
  const item = navItems[itemIndex];
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.path);
  const Icon = item.icon;
  return (
    <Link
      href={item.path}
      className={`flex items-center space-x-3 p-3 rounded-lg transition duration-150 ${
        isActive
          ? "bg-primary text-primary-foreground font-semibold shadow-md"
          : "text-muted-foreground"
      }`}
    >
      <Icon />
      <span className="text-sm">{item.name}</span>
    </Link>
  );
};

export default NavigationItem;
