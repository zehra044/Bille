import prisma from "../prisma/prisma";
import { calculateSummary } from "./ledger.service";

export async function createCustomer(data: {
  fullName: string;
  phoneNumber: string;
  address?: string;
  notes?: string;
}) {
  return prisma.customer.create({
    data,
  });
}

export async function getCustomers() {
  return prisma.customer.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: {
      id,
    },
    include: {
      transactions: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });
}


export async function getCustomerSummary(id: string) {
  return prisma.customer.findUnique({
    where: {
      id,
    },
    include: {
      transactions: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
}

export async function updateCustomer(
  id: string,
  data: { fullName?: string; phoneNumber?: string; address?: string | null; notes?: string | null },
) {
  const customer = await prisma.customer.findFirst({
    where: { id, isArchived: false },
    select: { id: true },
  });
  if (!customer) return null;

  return prisma.customer.update({ where: { id }, data });
}

export async function archiveCustomer(id: string, confirmed: boolean) {
  const customer = await getCustomerSummary(id);
  if (!customer || customer.isArchived) return { status: "NOT_FOUND" as const };

  const { balance } = calculateSummary(customer.transactions);
  if (balance !== 0 && !confirmed) {
    return { status: "CONFIRMATION_REQUIRED" as const, balance };
  }

  const archived = await prisma.customer.update({
    where: { id },
    data: { isArchived: true },
  });
  return { status: "ARCHIVED" as const, customer: archived };
}
