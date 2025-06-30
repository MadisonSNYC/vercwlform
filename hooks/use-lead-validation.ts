// hooks/use-lead-validation.ts
import { z } from "zod"

export const LeadFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .max(100, {
      message: "Full name must not exceed 100 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\s\-()]{7,20}$/.test(val), {
      message: "Please enter a valid phone number.",
    }),
  address: z
    .string()
    .min(5, {
      message: "Address must be at least 5 characters.",
    })
    .max(200, {
      message: "Address must not exceed 200 characters.",
    }),
  borough: z.enum(["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"], {
    errorMap: () => ({ message: "Please select a valid borough." }),
  }),
  leaseTerm: z
    .string()
    .min(1, {
      message: "Lease term is required.",
    })
    .max(50, {
      message: "Lease term must not exceed 50 characters.",
    }),
  moveInDate: z
    .date({
      required_error: "A move-in date is required.",
      invalid_type_error: "That's not a valid date!",
    })
    .min(new Date(), {
      message: "Move-in date cannot be in the past.",
    }),
  budget: z
    .number()
    .min(100, {
      message: "Budget must be at least 100.",
    })
    .max(100000, {
      message: "Budget must not exceed 100,000.",
    }),
  notes: z
    .string()
    .max(500, {
      message: "Notes must not exceed 500 characters.",
    })
    .optional(),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "paypal"], {
    errorMap: () => ({ message: "Please select a valid payment method." }),
  }),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})
