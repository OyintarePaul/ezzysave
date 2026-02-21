import { z } from "zod";
export const registerFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long")
      // 1. At least one uppercase letter
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      // 2. At least one lowercase letter
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      // 3. At least one number
      .regex(/[0-9]/, "Password must contain at least one number")
      // 4. At least one special character
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character (@, #, $, etc.)",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
