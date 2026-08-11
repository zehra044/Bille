export type Customer = {
  id: string;
  fullName: string;
  phoneNumber: string;
  address?: string;
  notes?: string;
  isArchived?: boolean;
};

export type Transaction = {
  id: string;
  type: "CHARGE" | "PAYMENT" | "ADJUSTMENT";
  amount: number;
  date: string;
  description?: string;
  paymentMethod?: string;
  reason?: string;
  notes?: string;
  deletedAt?: string | null;
  customer?: { id: string; fullName: string };
};

export type CustomerSummary = {
  customer: {
    id: string;
    fullName: string;
    phoneNumber: string;
  };
  summary: {
    totalCharges: number;
    totalPayments: number;
    totalAdjustments: number;
    balance: number;
  };
};

export type DashboardSummary = {
  totalCustomers: number;
  totalOutstandingBalance: number;
  totalCollected: number;
  activeCustomers: number;
  recentTransactions: Array<{
    id: string;
    type: "CHARGE" | "PAYMENT" | "ADJUSTMENT";
    amount: number | string;
    date: string;
    customer: { id: string; fullName: string };
  }>;
};

export type CollectionReport = {
  totalCollected: number;
  transactions: Array<{
    id: string;
    type: "CHARGE" | "PAYMENT" | "ADJUSTMENT";
    amount: number | string;
    date: string;
    customer: { id: string; fullName: string; phoneNumber: string };
  }>;
};

export type OutstandingBalanceEntry = {
  customer: { id: string; fullName: string; phoneNumber: string };
  summary: {
    totalCharges: number;
    totalPayments: number;
    totalAdjustments: number;
    balance: number;
  };
};

export type TrashContent = {
  customers: Customer[];
  transactions: Array<{
    id: string;
    type: "CHARGE" | "PAYMENT" | "ADJUSTMENT";
    amount: number | string;
    date: string;
    deletedAt?: string | null;
    customer: { id: string; fullName: string };
  }>;
};
