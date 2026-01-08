import { getCurrentUser, pageAuthGuard } from "@/lib/auth";
import OverviewUI from "./ui";
import { getPayloadCustomerByClerkId, getStats } from "@/lib/payload";

export default async function OverviewPage() {
  await pageAuthGuard("/dashboard/overview"); // Protect the page, redirect if not authenticated
  const user = await getCurrentUser();
  const customer = await getPayloadCustomerByClerkId(user.id);

  if (!customer) {
    throw new Error(`Customer with clerkId: ${user.id} not found`);
  }

  const stats = await getStats(customer.id);

  return <OverviewUI stats={stats} />;
}
