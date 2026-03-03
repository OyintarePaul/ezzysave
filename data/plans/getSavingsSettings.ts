import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";

export const getSavingsSettings = cache(async () => {
  const payload = await getPayloadClient();
  return payload.findGlobal({
    slug: "savings-settings",
  });
});
