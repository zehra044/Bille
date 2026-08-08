import { z } from "zod";

const customerSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  phoneNumber: z.string().min(1),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  isArchived: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const transactionSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  type: z.enum(["CHARGE", "PAYMENT", "ADJUSTMENT"]),
  amount: z.number().finite(),
  description: z.string().nullable(),
  paymentMethod: z.string().nullable(),
  reason: z.string().nullable(),
  notes: z.string().nullable(),
  date: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.coerce.date(),
  customers: z.array(customerSchema),
  transactions: z.array(transactionSchema),
});

export const restoreBackupSchema = z.object({
  confirm: z.literal(true),
  backup: backupSchema,
});
