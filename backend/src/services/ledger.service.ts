import { TransactionType } from "@prisma/client";

interface LedgerTransaction {
  type: TransactionType;
  amount: number | { toNumber(): number };
  date?: Date;
  createdAt?: Date;
}

export function calculateSummary(transactions: LedgerTransaction[]) {
  let totalCharges = 0;
  let totalPayments = 0;
  let totalAdjustments = 0;

  for (const transaction of transactions) {
    const amount = typeof transaction.amount === "number"
      ? transaction.amount
      : transaction.amount.toNumber();

    switch (transaction.type) {
      case TransactionType.CHARGE:
        totalCharges += amount;
        break;

      case TransactionType.PAYMENT:
        totalPayments += amount;
        break;

      case TransactionType.ADJUSTMENT:
        totalAdjustments += amount;
        break;
    }
  }

  const balance =
    totalCharges -
    totalPayments +
    totalAdjustments;

  return {
    totalCharges,
    totalPayments,
    totalAdjustments,
    balance,
  };
}

/**
 * A financial history is valid only when it never goes below zero at any point
 * in time. Sorting by transaction date also protects backdated edits/entries.
 */
export function assertNonNegativeBalance(transactions: LedgerTransaction[]) {
  const ordered = [...transactions].sort((left, right) => {
    const byDate = (left.date?.getTime() ?? 0) - (right.date?.getTime() ?? 0);
    return byDate || (left.createdAt?.getTime() ?? 0) - (right.createdAt?.getTime() ?? 0);
  });

  let balance = 0;
  for (const transaction of ordered) {
    const amount = typeof transaction.amount === "number"
      ? transaction.amount
      : transaction.amount.toNumber();

    balance += transaction.type === TransactionType.PAYMENT ? -amount : amount;
    if (balance < 0) {
      throw new Error("This transaction would make the customer's balance negative");
    }
  }
}
