import type { CollectionConfig } from "payload";

export const Customers: CollectionConfig = {
  slug: "customers",
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "clerkId",
      type: "text",
      required: true,
      index: true,
      unique: true,
      admin: {
        hidden: true,
      },
    },
  ],
};
