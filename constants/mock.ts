export interface SavingsPlan {
  id: number;
  name: string;
  type: "Target" | "Fixed" | "Daily";
  currentAmount: number;
  targetAmount: number;
  interestRate: number;
  status: "Active" | "Matured";
  transactions?: Transaction[]; // Optional transaction history
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "Deposit" | "Withdrawal" | "Interest";
  category?: "Savings" | "Loans" | "Interest";
  status?: "Completed" | "Pending" | "Failed";
}

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: "2024-10-25",
    description: "Monthly Salary Deposit",
    type: "Deposit",
    category: "Savings",
    amount: 5000.0,
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-10-24",
    description: "Withdrawal for Rent",
    type: "Withdrawal",
    category: "Interest",
    amount: -1200.0,
    status: "Completed",
  },
  {
    id: 3,
    date: "2024-10-23",
    description: "Daily Savings Contribution",
    type: "Deposit",
    category: "Savings",
    amount: 50.0,
    status: "Completed",
  },
  {
    id: 4,
    date: "2024-10-22",
    description: "Loan Repayment - October",
    type: "Deposit",
    category: "Loans",
    amount: -350.0,
    status: "Pending",
  },
  {
    id: 5,
    date: "2024-10-21",
    description: "Target Savings Goal: Vacation",
    type: "Deposit",
    category: "Savings",
    amount: 300.0,
    status: "Completed",
  },
  {
    id: 6,
    date: "2024-10-20",
    description: "ATM Withdrawal",
    type: "Withdrawal",
    category: "Interest",
    amount: -200.0,
    status: "Completed",
  },
  {
    id: 7,
    date: "2024-10-19",
    description: "Interest Earned",
    type: "Deposit",
    category: "Savings",
    amount: 15.5,
    status: "Completed",
  },
  {
    id: 8,
    date: "2024-10-18",
    description: "Emergency Loan Disbursement",
    type: "Deposit",
    category: "Loans",
    amount: 1000.0,
    status: "Completed",
  },
];

export const mockSavingsPlans: SavingsPlan[] = [
  {
    id: 1,
    name: "Euro Trip Fund",
    type: "Target",
    currentAmount: 4800,
    targetAmount: 7500,
    interestRate: 4.5,
    status: "Active",
    transactions: [
      {
        id: 1,
        date: "2025-10-20",
        description: "Monthly scheduled deposit",
        amount: 500,
        type: "Deposit",
      },
      {
        id: 2,
        date: "2025-10-01",
        description: "Quarterly interest payout",
        amount: 12.5,
        type: "Interest",
      },
      {
        id: 3,
        date: "2025-09-15",
        description: "Emergency withdrawal",
        amount: -200,
        type: "Withdrawal",
      },
      {
        id: 4,
        date: "2025-09-01",
        description: "Initial setup deposit",
        amount: 4500,
        type: "Deposit",
      },
    ],
  },
  {
    id: 2,
    name: "Emergency Lockbox",
    type: "Fixed",
    currentAmount: 5000,
    targetAmount: 5000,
    interestRate: 6.0,
    status: "Active",
  },
  {
    id: 3,
    name: "Car Down Payment",
    type: "Target",
    currentAmount: 12500,
    targetAmount: 20000,
    interestRate: 4.0,
    status: "Active",
  },
  {
    id: 4,
    name: "Daily Fun Money",
    type: "Daily",
    currentAmount: 500,
    targetAmount: 500,
    interestRate: 3.5,
    status: "Matured",
  },
  {
    id: 5,
    name: "Q4 Bonus Savings",
    type: "Fixed",
    currentAmount: 2000,
    targetAmount: 2000,
    interestRate: 5.2,
    status: "Matured",
  },
  {
    id: 6,
    name: "Gaming PC Fund",
    type: "Target",
    currentAmount: 850,
    targetAmount: 1500,
    interestRate: 3.8,
    status: "Active",
  },
];

// Mock Loan Data
export interface Loan {
  id: string;
  name: string;
  originalAmount: number;
  balance: number;
  status: "Active" | "Paid Off" | "Deferred";
  rate: number;
  type: "Auto" | "Personal" | "Student";
}

export const mockLoans: Loan[] = [
  {
    id: "L1",
    name: "Auto Loan",
    originalAmount: 35000,
    balance: 12450,
    status: "Active",
    rate: 4.5,
    type: "Auto",
  },
  {
    id: "L2",
    name: "Personal Loan",
    originalAmount: 5000,
    balance: 1120,
    status: "Paid Off",
    rate: 7.0,
    type: "Personal",
  },
  {
    id: "L3",
    name: "Student Loan",
    originalAmount: 55000,
    balance: 48900,
    status: "Deferred",
    rate: 6.2,
    type: "Student",
  },
];
