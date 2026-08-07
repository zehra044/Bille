import { TransactionType } from "@prisma/client";

interface LedgerTransaction {
  type: TransactionType;
  amount: number;
}

export function calculateSummary(transactions: LedgerTransaction[]) {
  let totalCharges = 0;
  let totalPayments = 0;
  let totalAdjustments = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);

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