// these schemas act as Data Transfer Objects (DTOs).
// They provide type safety and runtime validation for Paystack API data.
import { z } from "zod";

export const bankSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export const bankArraySchema = z.array(bankSchema);
export type BankArray = z.infer<typeof bankArraySchema>;

export const resolveAccountSchema = z.object({
  account_number: z.string(),
  account_name: z.string(),
});
export type ResolveAccount = z.infer<typeof resolveAccountSchema>;

export const receipientCodeSchema = z.string().min(1);
export type ReceipientCode = z.infer<typeof receipientCodeSchema>;
