import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageLayout from "../../components/page-layout";
import UpdateProfileForm from "./UpdateProfileForm";

export default function Profile() {
  return (
    <PageLayout
      title="Personal Information"
      subtitle="Manage your name, email, and phone number."
      backHref="/dashboard/settings"
    >
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
            Personal Information
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <UpdateProfileForm />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
