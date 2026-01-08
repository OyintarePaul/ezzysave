import { getCurrentUser, pageAuthGuard } from "@/lib/auth";
import TransactionsUI from "./ui";
import { getPayloadCustomerByClerkId, getTransactions } from "@/lib/payload";

export default async function Transactions() {
  await pageAuthGuard("/dashboard/transactions"); // Protect the page, redirect if not authenticated
    const user = await getCurrentUser();
    const customer = await getPayloadCustomerByClerkId(user.id);
    if (!customer) {
      throw new Error(`Customer with clerkId: ${user.id} not found`);
    }

    const transactions = await getTransactions(customer.id)

  return <TransactionsUI transactions={transactions} />
}