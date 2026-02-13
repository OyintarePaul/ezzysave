import { z } from "zod";

export const pinUpdateFormSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    newPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must be numeric"),
    confirmPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must be numeric"),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "New PIN and Confirm PIN must match",
  });

export type PinUpdateData = z.infer<typeof pinUpdateFormSchema>;
