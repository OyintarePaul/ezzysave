import { pageAuthGuard } from "@/lib/auth";
import OverviewUI from "./ui";

export default async function OverviewPage() {
  await pageAuthGuard("/dashboard/overview");
  return <OverviewUI />;
}
