import { CollectionConfig } from "payload";

export const Transactions: CollectionConfig = {
  slug: "transactions",
  admin: {
    useAsTitle: "",
  },
  fields: [
    {
      name: "description",
      type: "text",
      required: true,
    },

    {
      name: "category",
      type: "select",
      options: ["Savings", "Loans", "Interests"],
    },

    {
      name: "type",
      type: "select",
      options: ["Withdrawal", "Deposit", "Interest"],
      required: true,
    },

    {
      name: "amount",
      type: "number",
      required: true,
    },
{
      name: "status",
      type: "select",
      options: ["pending", "completed", "failed"],
      required: true,
    },

    {
      name: "plan",
      type: "relationship",
      relationTo: "savings-plans",
      index: true,
    },
    {
      name: "loan",
      type: "relationship",
      relationTo: "loans",
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      index: true,
    },
    {
      name: "paystackRef",
      type: "text",
      unique: true,
      index: true,
    },
  ],
};
