import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfileDisplay: React.FC = () => (
  <div className="flex items-center space-x-3">
    <Avatar className="size-10">
      {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
      <AvatarFallback className="bg-primary/10">EO</AvatarFallback>
    </Avatar>
    <div className="hidden sm:block">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Auth User Name
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
    </div>
  </div>
);

export default UserProfileDisplay;
