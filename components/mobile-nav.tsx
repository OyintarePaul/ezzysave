"use client";
import { menuItems } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-between gap-2 items-center p-4 z-500 bg-background">
      {menuItems.map((item, index) => (
        <Link href={item.href} className="flex-1 flex justify-center items-center" key={index} title={item.name}>
          <item.Icon
            className={cn("size-6 text-muted-foreground", {
              "text-primary": pathname == item.href,
            })}
          />
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
