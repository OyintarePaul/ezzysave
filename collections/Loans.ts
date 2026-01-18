import type { CollectionConfig } from "payload";
export const Loans: CollectionConfig = {
  slug: "loans",
  admin: {
    useAsTitle: "amount",
  },
  fields: [
    {
      name: "amount",
      type: "number",
      required: true,
    },
    {
      name: "amountPaid",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "purpose",
      type: "text",
      required: true,
    },

    {
      name: "interestRate",
      type: "number",
      defaultValue: 5,
    },
    {
      name: "duration",
      type: "number",
      required: true,
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Active", value: "active" },
        { label: "Approved", value: "approved" },
        { label: "Reject", value: "rejected" },
        { label: "Deferred", value: "deferred" },
        { label: "Paid Off", value: "paidOff" },
      ],
      defaultValue: "pending",
    },
  ],
};
