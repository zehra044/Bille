import prisma from "../prisma/prisma";
import { TransactionType } from "@prisma/client";

interface CreateTransactionData {
  customerId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  paymentMethod?: string;
  reason?: string;
  notes?: string;
}

export async function createTransaction(
  customerId: string,
  data: {
    type: "CHARGE" | "PAYMENT" | "ADJUSTMENT";
    amount: number;
    description?: string;
    paymentMethod?: string;
    reason?: string;
    notes?: string;
  }
) {
  return prisma.transaction.create({
    data: {
      customerId,
      type: data.type,
      amount: data.amount,
      description: data.description,
      paymentMethod: data.paymentMethod,
      reason: data.reason,
      notes: data.notes,
      date: new Date(),
    },
  });
}

export async function getCustomerTransactions(customerId: string) {
  return prisma.transaction.findMany({
    where: {
      customerId,
      deletedAt: null,
    },
    orderBy: {
      date: "desc",
    },
  });
}


