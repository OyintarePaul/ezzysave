import { z } from "zod";

export const depositFormSchema = z.object({
  planId: z.string().min(1, "Plan Id is required"),
  amount: z.number().min(50, "Minimum deposit amount is NGN50"),
});

export type DepositFormData = z.infer<typeof depositFormSchema>;
