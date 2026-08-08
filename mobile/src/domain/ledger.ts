export type TransactionType = "CHARGE" | "PAYMENT" | "ADJUSTMENT";

export interface LedgerTransaction {
  id: string;
  customerId: string;
  type: TransactionType;
  /** Monetary value in minor units (for example, cents). */
  amount: number;
  date: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  paymentMethod?: string | null;
  reason?: string | null;
  notes?: string | null;
}

export interface LedgerSummary {
  totalCharges: number;
  totalPayments: number;
  totalAdjustments: number;
  balance: number;
}

export interface TransactionWithBalance extends LedgerTransaction {
  balanceAfter: number;
}

export class LedgerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LedgerValidationError";
  }
}

export function activeTransactions(transactions: LedgerTransaction[]) {
  return transactions.filter((transaction) => !transaction.deletedAt);
}

export function chronologicalTransactions(transactions: LedgerTransaction[]) {
  return [...activeTransactions(transactions)].sort((left, right) => {
    const byDate = left.date.localeCompare(right.date);
    return byDate || left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id);
  });
}

export function transactionEffect(transaction: LedgerTransaction) {
  if (transaction.type === "PAYMENT") return -transaction.amount;
  return transaction.amount;
}

export function calculateSummary(transactions: LedgerTransaction[]): LedgerSummary {
  return activeTransactions(transactions).reduce<LedgerSummary>(
    (summary, transaction) => {
      if (transaction.type === "CHARGE") summary.totalCharges += transaction.amount;
      if (transaction.type === "PAYMENT") summary.totalPayments += transaction.amount;
      if (transaction.type === "ADJUSTMENT") summary.totalAdjustments += transaction.amount;
      summary.balance += transactionEffect(transaction);
      return summary;
    },
    { totalCharges: 0, totalPayments: 0, totalAdjustments: 0, balance: 0 },
  );
}

/** Produces the history shown to users, including balance after each entry. */
export function withRunningBalances(transactions: LedgerTransaction[]): TransactionWithBalance[] {
  let balance = 0;
  return chronologicalTransactions(transactions).map((transaction) => {
    balance += transactionEffect(transaction);
    return { ...transaction, balanceAfter: balance };
  });
}

/**
 * Checks the invariants that protect a customer's financial record.
 * It is intentionally called after creates, edits, restores, and soft deletes.
 */
export function assertValidLedger(transactions: LedgerTransaction[]) {
  let balance = 0;

  for (const transaction of chronologicalTransactions(transactions)) {
    assertValidTransaction(transaction);
    balance += transactionEffect(transaction);
    if (balance < 0) {
      throw new LedgerValidationError(
        "This transaction would make the customer's balance negative.",
      );
    }
  }
}

export function assertValidTransaction(transaction: LedgerTransaction) {
  if (!Number.isSafeInteger(transaction.amount)) {
    throw new LedgerValidationError("Amount must be stored as a whole number of minor currency units.");
  }

  if (transaction.type === "ADJUSTMENT") {
    if (transaction.amount === 0) throw new LedgerValidationError("Adjustment amount cannot be zero.");
    if (!transaction.reason?.trim()) throw new LedgerValidationError("An adjustment reason is required.");
    return;
  }

  if (transaction.amount <= 0) {
    throw new LedgerValidationError("Amount must be greater than zero.");
  }

  if (transaction.type === "PAYMENT" && !transaction.paymentMethod?.trim()) {
    throw new LedgerValidationError("A payment method is required.");
  }

  if (transaction.type === "CHARGE" && !transaction.description?.trim()) {
    throw new LedgerValidationError("A charge description is required.");
  }
}
