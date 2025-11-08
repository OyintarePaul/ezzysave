"use client";
import { usePathname } from "next/navigation";
import UserProfileDisplay from "./user-profile-display";
import { navItems } from "@/constants";
import { NavItem } from "@/types";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  return (
    // Sidebar is hidden on small screens and shown as a fixed component on large screens
    <div className="hidden lg:flex flex-col w-64 bg-white border-r p-5 justify-between dark:bg-gray-900 dark:border-gray-700 h-full">
      <div>
        <h2 className="text-3xl font-extrabold text-primary mb-10 pt-1">
          <Link href="/">EzzySave</Link>
        </h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={pathname.startsWith(item.path)}
            />
          ))}
        </nav>
      </div>

      {/* User Placeholder - Always at the bottom of the sidebar */}
      <div className="p-3 border-t pt-4 mt-8">
        <UserProfileDisplay />
      </div>
    </div>
  );
};

const NavigationItem: React.FC<{ item: NavItem; isActive: boolean }> = ({
  item,
  isActive,
}) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.path}
      className={`flex items-center space-x-3 p-3 rounded-lg transition duration-150 ${
        isActive
          ? "bg-primary text-primary-foreground font-semibold shadow-md"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      <Icon />
      <span className="text-sm">{item.name}</span>
    </Link>
  );
};

export default Sidebar;
