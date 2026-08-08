import prisma from "../prisma/prisma";
import { assertNonNegativeBalance } from "./ledger.service";
import { backupSchema } from "../validations/backup.validation";

export async function exportBackup() {
  const [customers, transactions] = await Promise.all([
    prisma.customer.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.transaction.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return {
    version: 1 as const,
    exportedAt: new Date(),
    customers,
    transactions: transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toNumber(),
    })),
  };
}

export async function restoreBackup(input: unknown) {
  const backup = backupSchema.parse(input);
  const customerIds = new Set(backup.customers.map((customer) => customer.id));
  if (customerIds.size !== backup.customers.length) throw new Error("Backup contains duplicate customer ids");
  if (backup.transactions.some((transaction) => !customerIds.has(transaction.customerId))) {
    throw new Error("Backup contains a transaction without a customer");
  }

  for (const customer of backup.customers) {
    assertNonNegativeBalance(
      backup.transactions.filter((transaction) => transaction.customerId === customer.id && !transaction.deletedAt),
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.transaction.deleteMany();
    await tx.customer.deleteMany();
    if (backup.customers.length) await tx.customer.createMany({ data: backup.customers });
    if (backup.transactions.length) await tx.transaction.createMany({ data: backup.transactions });
  });

  return { customersRestored: backup.customers.length, transactionsRestored: backup.transactions.length };
}
