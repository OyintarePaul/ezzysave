import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const UserProfileDisplay: React.FC = () => (
  <Link href="/profile" className="flex items-center space-x-3">
    <Avatar className="size-10">
      <AvatarImage src="" />
      <AvatarFallback className="bg-primary/10">EO</AvatarFallback>
    </Avatar>
    <div className="hidden sm:block">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        User Name
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
    </div>
  </Link>
);

export default UserProfileDisplay;
