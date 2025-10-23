import SettingsContent from "@/components/settings";
import { Button } from "@/components/ui/button";
import { pageAuthGuard } from "@/lib/auth";

export default async function SettingsPage() {
  await pageAuthGuard("/dashboard/settings");

  return (
    <div>
      <SettingsContent />
      <Button asChild variant="destructive">
        <a href="/auth/logout">Log out</a>
      </Button>
    </div>
  );
}
