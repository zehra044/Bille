import { TransactionType } from "@prisma/client";
import prisma from "../prisma/prisma";
import { calculateSummary } from "./ledger.service";

export async function getDashboardSummary() {
  const customers = await prisma.customer.findMany({
    where: { isArchived: false },
    include: {
      transactions: {
        where: { deletedAt: null },
        select: { type: true, amount: true },
      },
    },
  });

  const summaries = customers.map((customer) => calculateSummary(customer.transactions));
  const recentTransactions = await prisma.transaction.findMany({
    where: { deletedAt: null, customer: { isArchived: false } },
    include: { customer: { select: { id: true, fullName: true } } },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: 10,
  });

  return {
    totalCustomers: customers.length,
    totalOutstandingBalance: summaries.reduce((total, summary) => total + Math.max(summary.balance, 0), 0),
    totalCollected: summaries.reduce((total, summary) => total + summary.totalPayments, 0),
    activeCustomers: summaries.filter((summary) => summary.balance > 0).length,
    recentTransactions,
  };
}
