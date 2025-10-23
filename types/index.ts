import { LucideIcon } from "lucide-react";

export interface TransactionDetails {
  method: string;
  bank: string;
  account: string;
  category: string;
  reason?: string; // Optional for failed transactions
}

/** Defines the main structure for a single transaction object. */
export interface Transaction {
  id: string;
  type: 'deposit' | 'transfer' | 'withdrawal' | 'pending' | 'failed';
  amount: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  from: string;
  to: string;
  reference: string;
  details: TransactionDetails;
}

/** Defines the structure for status configuration. */
export interface StatusConfig {
  color: string;
  icon: LucideIcon;
  label: string;
  iconColor: string;
}

// --- Utility Component for Detail Rows (Typed) ---

export interface DetailRowProps {
    label: string;
    value: string;
    className?: string;
}


export interface NavItem {
    id: number;
    name: string;
    icon: LucideIcon;
    path: string; // Placeholder path for future routing
}