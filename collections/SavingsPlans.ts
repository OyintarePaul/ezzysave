import type { CollectionConfig } from "payload";

export const SavingsPlans: CollectionConfig = {
  slug: "savings-plans",
  admin: {
    useAsTitle: "planName",
  },
  fields: [
    {
      name: "planName",
      type: "text",
      required: true,
    },
    {
      name: "planType",
      type: "select",
      options: ["Target", "Fixed", "Daily"],
      required: true,
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
    },
    {
      name: "status",
      type: "select",
      options: ["Active", "Matured"],
      defaultValue: "Active",
    },
    {
      name: "currentBalance",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "interestEarned",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "interestRate",
      type: "number", // annual percentage
      defaultValue: 0,
    },

    // target specific fields
    {
      name: "targetAmount",
      type: "number",
      admin: {
        condition: (data) => data.planType === "Target",
      },
    },
    {
      name: "targetDate",
      type: "date",
      admin: {
        condition: (data) => data.planType === "Target",
      },
    },

    // Fixed Saving Specific
    {
      name: "fixedAmount",
      type: "number",
      admin: {
        condition: (data) => data.planType === "Fixed",
      },
    },
    {
      name: "duration",
      type: "number", // in months
      admin: {
        condition: (data) => data.planType === "Fixed",
      },
    },
    {
      name: "maturityDate",
      type: "date",
      admin: {
        condition: (data) => data.planType === "Fixed",
      },
    },

    // Daily Saving Specific
    {
      // how much to save daily
      name: "dailyAmount",
      type: "number",
      admin: {
        condition: (data) => data.planType === "Daily",
      },
    },
    {
      name: "numberOfDays",
      type: "number",
      admin: {
        condition: (data) => data.planType === "Daily",
      },
    },
  ],
};
