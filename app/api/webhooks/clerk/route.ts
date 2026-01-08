import { createPayloadCustomer, deletePayloadCustomer, updatePayloadCustomer } from "@/lib/payload";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    if (evt.type == "user.created") {
      // Handle user creation
      try {
        const newUser = await createPayloadCustomer(evt.data.id, {
          firstName: evt.data.first_name || "",
          lastName: evt.data.last_name || "",
          email: evt.data.email_addresses[0]?.email_address,
          phone:
            evt.data.phone_numbers.length > 0
              ? evt.data.phone_numbers[0].phone_number
              : undefined,
        });
        console.log("Created new Payload user:", newUser);
      } catch (e) {
        console.error("Error creating Payload user:", e);
      }
    }

    if (evt.type == "user.updated") {
      // Handle user update
        try {
          const updatedUser = await updatePayloadCustomer(evt.data.id, {
            firstName: evt.data.first_name || "",
            lastName: evt.data.last_name || "",
            email: evt.data.email_addresses[0]?.email_address,
            phone:
              evt.data.phone_numbers.length > 0
                ? evt.data.phone_numbers[0].phone_number
                : undefined,
          });
          console.log("Updated Payload customer:", updatedUser);
        } catch (e) {
          console.error("Error updating Payload customer:", e);
        }
    }

    if (evt.type == "user.deleted") {
      try {
        await deletePayloadCustomer(evt.data.id as string);
        console.log("Deleted Payload customer with Clerk ID:", evt.data.id);
      } catch (e) {
        console.error("Error deleting Payload customer:", e);
      }
    }
  } catch (e) {
    console.error("Error verifying webhook");
    return new Response("Error Verifying webhook", { status: 400 });
  }

  return new Response("Webhook received", { status: 200 });
}
