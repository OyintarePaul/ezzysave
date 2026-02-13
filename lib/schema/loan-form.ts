import { z } from "zod";
export const loanFormSchema = z.object({
  amount: z.number(),
  purpose: z.string(),
  duration: z.number(),
});

export type LoanFormData = z.infer<typeof loanFormSchema>;
