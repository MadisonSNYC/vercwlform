// hooks/use-report-validation.ts
import { z } from "zod"

export const ReportFormSchema = z.object({
  reporterName: z
    .string()
    .min(2, {
      message: "Your name must be at least 2 characters.",
    })
    .max(100, {
      message: "Your name must not exceed 100 characters.",
    }),
  reporterEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  incidentDate: z
    .date({
      required_error: "Incident date is required.",
      invalid_type_error: "That's not a valid date!",
    })
    .max(new Date(), {
      message: "Incident date cannot be in the future.",
    }),
  incidentTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in HH:MM format.",
  }),
  location: z
    .string()
    .min(5, {
      message: "Location must be at least 5 characters.",
    })
    .max(200, {
      message: "Location must not exceed 200 characters.",
    }),
  borough: z.enum(["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"], {
    errorMap: () => ({ message: "Please select a valid borough." }),
  }),
  fareAmount: z
    .number()
    .min(0, {
      message: "Fare amount cannot be negative.",
    })
    .max(1000, {
      message: "Fare amount must not exceed 1000.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters.",
    }),
  contactPermission: z.boolean(),
})
