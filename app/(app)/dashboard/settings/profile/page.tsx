import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageLayout from "../../components/page-layout";
import UpdateProfileForm from "./UpdateProfileForm";
import UserProfileDisplay from "./UserProfileDisplay";

export default function Profile() {
  return (
    <PageLayout
      title="Personal Information"
      subtitle="Manage your name, email, and phone number."
      backHref="/dashboard/settings"
    >
      <UserProfileDisplay />
    </PageLayout>
  );
}
