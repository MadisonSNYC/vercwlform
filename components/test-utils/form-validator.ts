import { z } from "zod"
import { FormType } from "@/lib/constants"

// Helper schema for optional string that can be empty
const optionalString = z
  .string()
  .optional()
  .transform((e) => (e === "" ? undefined : e))

// Schemas for nested arrays
const landlordSchema = z.object({
  name: optionalString,
  company: optionalString,
})

const brokerSchema = z.object({
  name: optionalString,
  company: optionalString,
  phone: optionalString,
  email: optionalString,
})

const brokerageSchema = z.object({
  name: optionalString,
  address: optionalString,
  phone: optionalString,
  email: optionalString,
})

export const leadCaptureSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  phone: optionalString.refine((val) => !val || /^\+?[0-9\s\-()]{7,20}$/.test(val), "Invalid phone number format."),
  selectedForm: z.nativeEnum(FormType, {
    errorMap: () => ({ message: "Please select what you would like to do." }),
  }),
  mailingListConsent: z.boolean().refine((val) => val === true, "You must consent to join the mailing list."),
  zipCode: z.string().regex(/^\d{5}$/, { message: "Invalid zip code." }),
  streetEasyLink: z.string().url({ message: "Invalid URL." }).optional().or(z.literal("")),
})

export const reportFormSchema = z
  .object({
    formType: z.nativeEnum(FormType),
    email: z.string().email("Invalid email address."), // Original email from lead form
    contactTime: optionalString,
    issueSnapshot: optionalString,
    hasStreetEasyListing: z.boolean(),
    // Corrected: Apply .url() directly to z.string() before making it optional and transforming
    streetEasyLink: z
      .string()
      .url("Invalid URL format.")
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
    manualAddress: optionalString,
    borough: optionalString,
    neighborhood: optionalString,
    manualUnit: optionalString,
    manualPrice: optionalString
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().positive("Price must be positive.").optional()),
    manualBedrooms: optionalString
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().int().positive("Bedrooms must be a positive integer.").optional()),
    manualBathrooms: optionalString
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().int().positive("Bathrooms must be a positive integer.").optional()),
    contactedBusiness: z.boolean(),
    employeeName: optionalString,
    whatHappened: optionalString,
    outcome: optionalString,
    landlordName: z.array(landlordSchema).optional(),
    brokerName: z.array(brokerSchema).optional(),
    brokerageName: z.array(brokerageSchema).optional(),
    violations: z.array(z.string()).optional(),
    violationOtherTexts: z.record(z.string(), optionalString).optional(),
    narrative: optionalString,
    additionalContext: optionalString,
    desiredOutcome: optionalString,
    desiredOutcomeOther: optionalString,
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    userEmail: z.string().email("Invalid email address."), // Email used in the report form
    userPhone: optionalString.refine(
      (val) => !val || /^\+?[0-9\s\-()]{7,20}$/.test(val),
      "Invalid phone number format.",
    ),
    preferredContact: optionalString,
    isVeteran: z.boolean(),
    dcwpConsent: z.boolean(),
    proxyConsent: z.boolean(),
    mailingListConsent: z.boolean(),
    referralSource: optionalString,
    referralSourceOther: optionalString,
    interests: z.array(z.string()).optional(),
    homeAddress: optionalString,
    address: z.string().min(1, { message: "Address is required." }),
    unit: z.string().optional(),
    rent: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid rent amount." }),
    brokerName: z.string().optional(),
    brokerEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal("")),
    brokerPhone: z
      .string()
      .regex(/^\d{10}$/, { message: "Invalid phone number." })
      .optional()
      .or(z.literal("")),
    landlordName: z.string().optional(),
    landlordEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal("")),
    landlordPhone: z
      .string()
      .regex(/^\d{10}$/, { message: "Invalid phone number." })
      .optional()
      .or(z.literal("")),
    moveInDate: z.string().min(1, { message: "Move-in date is required." }),
    leaseTerm: z.string().min(1, { message: "Lease term is required." }),
    feeAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid fee amount." }),
    feeDescription: z.string().optional(),
    paymentMethod: z.string().min(1, { message: "Payment method is required." }),
    proofOfPayment: z.string().url({ message: "Invalid URL." }).optional().or(z.literal("")),
    communicationRecords: z.string().url({ message: "Invalid URL." }).optional().or(z.literal("")),
    additionalInfo: z.string().optional(),
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
      .min(3, {
        message: "Location must be at least 3 characters.",
      })
      .max(200, {
        message: "Location must not exceed 200 characters.",
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
  .superRefine((data, ctx) => {
    if (data.formType === FormType.Report) {
      // Property Information validation
      if (data.hasStreetEasyListing) {
        if (!data.streetEasyLink) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "StreetEasy link is required if listing exists.",
            path: ["streetEasyLink"],
          })
        }
      } else {
        if (!data.manualAddress) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Property address is required if no StreetEasy listing.",
            path: ["manualAddress"],
          })
        }
        if (!data.borough) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Borough is required if no StreetEasy listing.",
            path: ["borough"],
          })
        }
      }

      // Responsible Parties validation
      const hasLandlord = data.landlordName?.some((l) => l.name || l.company)
      const hasBroker = data.brokerName?.some((b) => b.name || b.company || b.phone || b.email)
      const hasBrokerage = data.brokerageName?.some((br) => br.name || br.address || br.phone || br.email)

      if (!hasLandlord && !hasBroker && !hasBrokerage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one of Landlord, Broker, or Brokerage information is required.",
          path: ["landlordName"], // Point to one of them, or a general field
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one of Landlord, Broker, or Brokerage information is required.",
          path: ["brokerName"],
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one of Landlord, Broker, or Brokerage information is required.",
          path: ["brokerageName"],
        })
      }

      // Violations validation
      if (!data.violations || data.violations.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one violation must be selected.",
          path: ["violations"],
        })
      } else {
        // Validate "Other" text fields if "Other" violation is selected
        if (data.violations.includes("Other - Listing") && !data.violationOtherTexts?.listing) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the other listing violation.",
            path: ["violationOtherTexts", "listing"],
          })
        }
        if (data.violations.includes("Other - Fee") && !data.violationOtherTexts?.fee) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the other fee violation.",
            path: ["violationOtherTexts", "fee"],
          })
        }
        if (data.violations.includes("Other - Behavior") && !data.violationOtherTexts?.behavior) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the other behavior violation.",
            path: ["violationOtherTexts", "behavior"],
          })
        }
      }

      // Narrative validation
      if (!data.narrative) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Narrative is required.",
          path: ["narrative"],
        })
      }

      // Desired Outcome validation
      if (!data.desiredOutcome) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Desired outcome is required.",
          path: ["desiredOutcome"],
        })
      } else if (data.desiredOutcome === "Other" && !data.desiredOutcomeOther) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify your desired outcome.",
          path: ["desiredOutcomeOther"],
        })
      }

      // Referral Source validation
      if (!data.referralSource) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Referral source is required.",
          path: ["referralSource"],
        })
      } else if (data.referralSource === "Other" && !data.referralSourceOther) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify how you heard about us.",
          path: ["referralSourceOther"],
        })
      }

      // Consents validation
      if (!data.dcwpConsent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "DCWP consent is required.",
          path: ["dcwpConsent"],
        })
      }
      if (!data.proxyConsent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Proxy consent is required.",
          path: ["proxyConsent"],
        })
      }
      if (!data.mailingListConsent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Mailing list consent is required.",
          path: ["mailingListConsent"],
        })
      }
    } else if (data.formType === FormType.Schedule || data.formType === FormType.Waitlist) {
      // For schedule/waitlist, ensure basic contact info is present
      if (!data.userEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email address is required.",
          path: ["userEmail"],
        })
      }
      if (!data.mailingListConsent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Mailing list consent is required.",
          path: ["mailingListConsent"],
        })
      }
    }
  })

export const LeadFormSchemaUpdated = z.object({
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
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/, {
      message: "Please enter a valid phone number (E.164 format recommended).",
    })
    .or(z.literal("")), // Allow empty string for optional
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
      message: "Please select a lease term.",
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
    .optional()
    .or(z.literal("")), // Allow empty string for optional
  paymentMethod: z.enum(["credit_card", "bank_transfer", "paypal"], {
    errorMap: () => ({ message: "Please select a valid payment method." }),
  }),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

export const ReportFormSchemaUpdated = z.object({
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
