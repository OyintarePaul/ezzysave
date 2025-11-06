import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function progressBarColor(plan: string) {
  return plan == "target" ? "bg-red-500" : plan == "fixed"  ? "bg-purple-500" : "bg-green-500";  
}

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};