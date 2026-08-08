import { z } from "zod";

export const createCustomerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters"),

  phoneNumber: z
    .string()
    .trim()
    .min(6, "Phone number is required"),

  address: z.string().trim().optional(),

  notes: z.string().trim().optional(),
});

export const updateCustomerSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters").optional(),
  phoneNumber: z.string().trim().min(6, "Phone number is required").optional(),
  address: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
}).refine((value) => Object.values(value).some((field) => field !== undefined), {
  message: "At least one customer field is required",
});
