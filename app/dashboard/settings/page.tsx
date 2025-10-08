import { Button } from "@/components/ui/button";
import { pageAuthGuard } from "@/lib/auth";

export default async function SettingsPage() {
  await pageAuthGuard("/dashboard/settings");

  return (
    <div>
      <h1>Other setting items are coming soon</h1>
      <Button className="w-full" asChild variant="outline">
        <a href="/auth/logout?federated">Log out</a>
      </Button>
    </div>
  );
}
