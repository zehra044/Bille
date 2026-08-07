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