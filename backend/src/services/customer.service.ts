import prisma from "../prisma/prisma";

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