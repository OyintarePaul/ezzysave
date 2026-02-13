import { z } from "zod";

export const withdrawalFormSchema = z.object({
  planId: z.string().min(1, "Plan Id is required"),
  amount: z.number().min(100, "Minimum withdrawable amount is NGN100"),
});

export type WithdrawalFormData = z.infer<typeof withdrawalFormSchema>;
