import { GlobalConfig } from "payload";

export const SavingsSettings: GlobalConfig = {
  slug: "savings-settings",
  admin: {
    group: "Admin", // Groups this in the sidebar
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "fixed",
          label: "Fixed Savings",
          fields: [
            {
              name: "interestRate",
              type: "number",
              required: true,
              admin: {
                description: "Annual interest rate for fixed plans (%)",
              },
            },
            {
              name: "minimumDeposit",
              type: "number",
              required: true,
            },
            {
              name: "withdrawalFee",
              type: "number",
              admin: { description: "Fee charged for early withdrawal (in %)" },
              required: true,
            },
          ],
        },
        {
          name: "target",
          label: "Target Savings",
          fields: [
            {
              name: "withdrawalFee",
              type: "number",
              admin: { description: "Fee charged for early withdrawal (in %)" },
              required: true,
            },
          ],
        },
        {
          name: "daily",
          label: "Daily Savings",
          fields: [
            {
              name: "withdrawalFee",
              type: "number",
              admin: { description: "Fee charged for early withdrawal (in %)" },
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
