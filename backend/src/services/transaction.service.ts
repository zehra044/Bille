import prisma from "../prisma/prisma";
import { TransactionType } from "@prisma/client";
import { assertNonNegativeBalance } from "./ledger.service";
import { createTransactionSchema } from "../validations/transaction.validation";

interface CreateTransactionData {
  type: TransactionType;
  amount: number;
  description?: string;
  paymentMethod?: string;
  reason?: string;
  notes?: string;
  date: Date;
}

export async function createTransaction(
  customerId: string,
  data: CreateTransactionData,
) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findFirst({
      where: { id: customerId, isArchived: false },
      select: { id: true },
    });
    if (!customer) throw new Error("Customer not found");

    const transactions = await tx.transaction.findMany({
      where: { customerId, deletedAt: null },
      select: { type: true, amount: true, date: true, createdAt: true },
    });
    const createdAt = new Date();
    assertNonNegativeBalance([...transactions, { ...data, createdAt }]);

    return tx.transaction.create({
      data: {
        customerId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        paymentMethod: data.paymentMethod,
        reason: data.reason,
        notes: data.notes,
        date: data.date,
        createdAt,
      },
    });
  });
}

export async function getCustomerTransactions(customerId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      customerId,
      deletedAt: null,
    },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  let balance = 0;
  return transactions.map((transaction) => {
    const amount = transaction.amount.toNumber();
    balance += transaction.type === TransactionType.PAYMENT ? -amount : amount;
    return { ...transaction, balanceAfter: balance };
  });
}

export async function softDeleteTransaction(customerId: string, transactionId: string) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findFirst({
      where: { id: transactionId, customerId, deletedAt: null },
    });
    if (!transaction) throw new Error("Transaction not found");

    const remaining = await tx.transaction.findMany({
      where: { customerId, deletedAt: null, id: { not: transactionId } },
      select: { type: true, amount: true, date: true, createdAt: true },
    });
    assertNonNegativeBalance(remaining);

    return tx.transaction.update({
      where: { id: transactionId },
      data: { deletedAt: new Date() },
    });
  });
}

export async function restoreTransaction(customerId: string, transactionId: string) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findFirst({
      where: { id: transactionId, customerId, deletedAt: { not: null } },
    });
    if (!transaction) throw new Error("Deleted transaction not found");

    const active = await tx.transaction.findMany({
      where: { customerId, deletedAt: null },
      select: { type: true, amount: true, date: true, createdAt: true },
    });
    assertNonNegativeBalance([...active, transaction]);

    return tx.transaction.update({
      where: { id: transactionId },
      data: { deletedAt: null },
    });
  });
}

export async function updateTransaction(
  customerId: string,
  transactionId: string,
  data: Partial<Omit<CreateTransactionData, "type">>,
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.transaction.findFirst({
      where: { id: transactionId, customerId, deletedAt: null },
    });
    if (!existing) throw new Error("Transaction not found");

    const candidate = {
      type: existing.type,
      amount: data.amount ?? existing.amount.toNumber(),
      date: data.date ?? existing.date,
      description: data.description ?? existing.description ?? undefined,
      paymentMethod: data.paymentMethod ?? existing.paymentMethod ?? undefined,
      reason: data.reason ?? existing.reason ?? undefined,
      notes: data.notes ?? existing.notes ?? undefined,
    };
    const parsed = createTransactionSchema.safeParse(candidate);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Invalid transaction update");
    }

    const otherTransactions = await tx.transaction.findMany({
      where: { customerId, deletedAt: null, id: { not: transactionId } },
      select: { type: true, amount: true, date: true, createdAt: true },
    });
    assertNonNegativeBalance([...otherTransactions, { ...parsed.data, createdAt: existing.createdAt }]);

    return tx.transaction.update({
      where: { id: transactionId },
      data: parsed.data,
    });
  });
}


