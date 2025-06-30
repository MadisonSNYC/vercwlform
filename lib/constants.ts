// lib/constants.ts

export type FormType = "lead" | "report"

export const SITE_NAME = "Public Transport Feedback"
export const SITE_DESCRIPTION =
  "Report issues, share feedback, and help shape a better public transportation experience for everyone."

// Navigation links
export const NAV_LINKS = [
  { name: "Home", href: "#" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "About", href: "#about" },
  { name: "FAQ", href: "#faq" },
  { name: "Support", href: "#support" },
]

// Example constants for form fields (can be expanded)
export const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]

export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
]
