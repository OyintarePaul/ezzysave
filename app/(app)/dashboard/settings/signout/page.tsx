import { LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "../../components/page-layout";
import SignOut from "./SignOut";

export default function SignOutPage() {
  return (
    <PageLayout
      title="Sign Out"
      subtitle="Securely end your session and log out of your account."
      backHref="/dashboard/settings"
    >
      <div className="flex items-center justify-center lg:pt-12">
        <Card className="rounded-[2.5rem] shadow-xl text-center max-w-md w-full">
          <CardContent>
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Sign Out
            </h3>
            <p className="text-sm text-muted-foreground mb-8 font-medium">
              Are you sure you want to end your session?
            </p>
            <SignOut />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
