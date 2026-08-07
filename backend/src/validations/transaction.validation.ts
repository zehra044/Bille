import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["CHARGE", "PAYMENT", "ADJUSTMENT"]),

  amount: z
    .number()
    .positive("Amount must be greater than zero"),

  description: z.string().trim().optional(),

  paymentMethod: z.string().trim().optional(),

  reason: z.string().trim().optional(),

  notes: z.string().trim().optional(),
});