"use client";
import { navItems } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  return (
    // Bottom Navigation is only visible on small screens
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t dark:bg-gray-900 dark:border-gray-700 z-50 shadow-2xl">
      <div className="flex justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full transition duration-150 text-xs ${
                pathname.startsWith(item.path)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon className="size-6" />
              <span className="mt-0.5">{item.name.split(" ")[0]}</span>{" "}
              {/* Use only the first word for ultra-small screens */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
