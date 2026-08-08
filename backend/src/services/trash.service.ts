import prisma from "../prisma/prisma";

export async function listTrash() {
  const [customers, transactions] = await Promise.all([
    prisma.customer.findMany({
      where: { isArchived: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.transaction.findMany({
      where: { deletedAt: { not: null } },
      include: { customer: { select: { id: true, fullName: true } } },
      orderBy: { deletedAt: "desc" },
    }),
  ]);
  return { customers, transactions };
}

export async function permanentlyDeleteTransaction(id: string) {
  const transaction = await prisma.transaction.findFirst({ where: { id, deletedAt: { not: null } } });
  if (!transaction) return null;
  return prisma.transaction.delete({ where: { id } });
}

export async function permanentlyDeleteCustomer(id: string) {
  const customer = await prisma.customer.findFirst({ where: { id, isArchived: true } });
  if (!customer) return null;
  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { customerId: id } }),
    prisma.customer.delete({ where: { id } }),
  ]);
  return customer;
}
