import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageLayout from "../../components/page-layout";
import UpdatePinForm from "./UpdatePinForm";

export default function SecuritySettingsPage() {
  return (
    <PageLayout
      title="Security & PIN"
      subtitle="Manage your account security settings."
      backHref="/dashboard/settings"
    >
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
            Withdrawal Pin Settings
          </h3>
        </CardHeader>
        <CardContent>
          <UpdatePinForm />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
