import { z } from "zod";

export const bankUpdateForm = z.object({
  bankCode: z.string().min(3, "Bank name is required"),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(10, "Account number must be at most 10 digits"),
  accountName: z.string().min(1, "Account name is not yet verified"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type BankUpdateData = z.infer<typeof bankUpdateForm>;
