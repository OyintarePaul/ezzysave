import { navItems } from "@/constants";
import Link from "next/link";
import NavigationItem from "./navigation-item";
import UserProfileDisplay from "./user-profile-display";

const Sidebar = async () => {
  return (
    // Sidebar is hidden on small screens and shown as a fixed component on large screens
    <div className="hidden lg:flex flex-col w-64 bg-white border-r p-5 justify-between h-full">
      <div>
        <h2 className="text-3xl font-extrabold text-primary mb-10 pt-1">
          <Link href="/dashboard/overview">EzzySave</Link>
        </h2>
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <NavigationItem key={item.id} itemIndex={index} />
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

export default Sidebar;
