import { z } from "zod";

const baseSchema = z.object({
  planName: z.string().min(3, "Required. Minimum of 3 characters"),
  initialDeposit: z.number().nullable().optional(),
});

const planUnion = z.discriminatedUnion("planType", [
  z.object({
    planType: z.literal("Daily"),
    dailyAmount: z.number(),
    numberOfDays: z.number(),
  }),
  z.object({
    planType: z.literal("Target"),
    targetAmount: z.number(),
    targetDate: z.string(),
  }),
  z.object({
    planType: z.literal("Fixed"),
    fixedAmount: z.number(),
    fixedDuration: z.number(),
  }),
]);

export const savingsSchema = baseSchema.and(planUnion);
export type SavingsFormData = z.infer<typeof savingsSchema>;
