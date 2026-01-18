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

    {
      name: "accountNumber",
      type: "text",
    },
    {
      name: "accountName",
      type: "text",
    },
    {
      name: "recipientCode",
      type: "text",
    },
    {
      name: "bankCode",
      type: "text",
    },

    {
      name: "withdrawalPin",
      type: "text",
      admin: {
        hidden: true,
      },
    },
  ],
};
