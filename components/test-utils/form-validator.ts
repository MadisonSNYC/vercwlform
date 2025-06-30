// components/test-utils/form-validator.ts
// This is a simplified client-side form validation utility for testing purposes.
// In a real application, you might use a library like Zod or React Hook Form.

interface ValidationRules {
  [key: string]: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | null
  }
}

export function validateForm(formData: Record<string, any>, rules: ValidationRules): Record<string, string | null> {
  const errors: Record<string, string | null> = {}

  for (const field in rules) {
    const value = formData[field]
    const fieldRules = rules[field]

    // Required check
    if (
      fieldRules.required &&
      (value === null || value === undefined || (typeof value === "string" && value.trim() === ""))
    ) {
      errors[field] = `${field} is required.`
      continue // Move to next field if required check fails
    }

    // Only apply further checks if value is not empty (unless it's a specific case)
    if (value !== null && value !== undefined && (typeof value !== "string" || value.trim() !== "")) {
      // MinLength check
      if (fieldRules.minLength && typeof value === "string" && value.length < fieldRules.minLength) {
        errors[field] = `${field} must be at least ${fieldRules.minLength} characters long.`
      }

      // MaxLength check
      if (fieldRules.maxLength && typeof value === "string" && value.length > fieldRules.maxLength) {
        errors[field] = `${field} must be no more than ${fieldRules.maxLength} characters long.`
      }

      // Pattern check
      if (fieldRules.pattern && typeof value === "string" && !fieldRules.pattern.test(value)) {
        errors[field] = `Invalid ${field} format.`
      }

      // Custom validation
      if (fieldRules.custom) {
        const customError = fieldRules.custom(value)
        if (customError) {
          errors[field] = customError
        }
      }
    }
  }

  return errors
}

export function hasErrors(errors: Record<string, string | null>): boolean {
  return Object.values(errors).some((error) => error !== null)
}
