import { z } from "zod";

export const withdrawalFormSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
  amount: z
    .number()
    .min(100, "Minimum withdrawable amount is NGN100")
    .max(100000, "Maximum withdrawable amount is NGN100,000"),
  pin: z.string().min(4, "Pin must be 4 digits long"),
});

export type WithdrawalFormData = z.infer<typeof withdrawalFormSchema>;
