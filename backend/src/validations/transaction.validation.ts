import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["CHARGE", "PAYMENT", "ADJUSTMENT"]),

  amount: z
    .number()
    .finite("Amount must be a valid number"),

  date: z.coerce.date(),

  description: z.string().trim().optional(),

  paymentMethod: z.string().trim().optional(),

  reason: z.string().trim().optional(),

  notes: z.string().trim().optional(),
}).superRefine((value, context) => {
  if (value.type !== "ADJUSTMENT" && value.amount <= 0) {
    context.addIssue({ code: "custom", path: ["amount"], message: "Amount must be greater than zero" });
  }

  if (value.type === "ADJUSTMENT" && value.amount === 0) {
    context.addIssue({ code: "custom", path: ["amount"], message: "Adjustment amount cannot be zero" });
  }

  if (value.type === "CHARGE" && !value.description) {
    context.addIssue({ code: "custom", path: ["description"], message: "A charge description is required" });
  }

  if (value.type === "PAYMENT" && !value.paymentMethod) {
    context.addIssue({ code: "custom", path: ["paymentMethod"], message: "A payment method is required" });
  }

  if (value.type === "ADJUSTMENT" && !value.reason) {
    context.addIssue({ code: "custom", path: ["reason"], message: "An adjustment reason is required" });
  }
});

export const updateTransactionSchema = z.object({
  amount: z.number().finite("Amount must be a valid number").optional(),
  date: z.coerce.date().optional(),
  description: z.string().trim().optional(),
  paymentMethod: z.string().trim().optional(),
  reason: z.string().trim().optional(),
  notes: z.string().trim().optional(),
}).refine((value) => Object.values(value).some((field) => field !== undefined), {
  message: "At least one transaction field is required",
});
