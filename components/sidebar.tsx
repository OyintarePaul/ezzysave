"use client";
import { menuItems } from "@/constants";
import { cn } from "@/lib/utils";
import { Box, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-sidebar text-sidebar-foreground border-r border-sidebar p-4 w-64 flex-col hidden md:flex">
      <div className="flex items-center gap-1">
        <Box className="size-6" />
        <span className="ml-2 text-lg font-bold">ZeeExclusive</span>
      </div>

      {/* Menu items */}
      <ul className="mt-8 space-y-2 flex-1">
        {menuItems.map(({ name, href, Icon }) => (
          <li key={name}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-2 py-3 px-2 hover:bg-gray-100 rounded-md",
                {
                  "bg-gray-200": pathname === href,
                }
              )}
            >
              <Icon className="size-5" />
              <span>{name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <a
        href="/auth/logout?federated"
        className="flex justify-self-end items-center gap-2 py-3 px-2 hover:bg-gray-200 rounded-md"
      >
        <LogOut className="size-5" />
        <span>Logout</span>
      </a>
    </nav>
  );
};

export default Sidebar;
