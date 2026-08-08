import prisma from "../prisma/prisma";
import { calculateSummary } from "./ledger.service";
import { getCustomerTransactions } from "./transaction.service";

function dayBounds(value: string) {
  const start = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) throw new Error("Date must use YYYY-MM-DD format");
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export async function getCustomerStatement(customerId: string) {
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, isArchived: false },
    select: { id: true, fullName: true, phoneNumber: true, address: true, notes: true },
  });
  if (!customer) return null;

  const transactions = await getCustomerTransactions(customerId);
  const summary = calculateSummary(transactions);
  return { customer, summary, transactions };
}

export async function getDailyCollectionReport(date: string) {
  const { start, end } = dayBounds(date);
  return prisma.transaction.findMany({
    where: {
      type: "PAYMENT",
      deletedAt: null,
      customer: { isArchived: false },
      date: { gte: start, lt: end },
    },
    include: { customer: { select: { id: true, fullName: true, phoneNumber: true } } },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });
}

export async function getMonthlyCollectionReport(year: number, month: number) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Year and month must be valid");
  }
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return prisma.transaction.findMany({
    where: {
      type: "PAYMENT",
      deletedAt: null,
      customer: { isArchived: false },
      date: { gte: start, lt: end },
    },
    include: { customer: { select: { id: true, fullName: true, phoneNumber: true } } },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });
}

export async function getOutstandingBalanceReport() {
  const customers = await prisma.customer.findMany({
    where: { isArchived: false },
    include: {
      transactions: { where: { deletedAt: null }, select: { type: true, amount: true } },
    },
  });

  return customers
    .map((customer) => ({
      customer: { id: customer.id, fullName: customer.fullName, phoneNumber: customer.phoneNumber },
      summary: calculateSummary(customer.transactions),
    }))
    .filter((entry) => entry.summary.balance > 0)
    .sort((left, right) => right.summary.balance - left.summary.balance);
}
