// components/test-utils/form-validator.ts

/**
 * Validates a form field based on a set of rules.
 * @param value The value of the field to validate.
 * @param rules An object containing validation rules (e.g., { required: true, minLength: 5 }).
 * @returns A string containing an error message if validation fails, otherwise null.
 */
export function validateField(
  value: string | number | boolean | undefined | null,
  rules: Record<string, any>,
): string | null {
  if (rules.required && (value === undefined || value === null || value === "")) {
    return "This field is required."
  }

  if (typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters long.`
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters long.`
    }
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      return rules.patternMessage || "Invalid format."
    }
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email address."
    }
  }

  if (typeof value === "number") {
    if (rules.min && value < rules.min) {
      return `Must be at least ${rules.min}.`
    }
    if (rules.max && value > rules.max) {
      return `Must be no more than ${rules.max}.`
    }
  }

  if (rules.checked && typeof value === "boolean" && !value) {
    return "Must be checked."
  }

  return null
}

/**
 * Validates an entire form by iterating through its fields and applying validation rules.
 * @param formData An object where keys are field names and values are field values.
 * @param validationSchema An object where keys are field names and values are validation rule objects.
 * @returns An object containing error messages for each invalid field, or an empty object if the form is valid.
 */
export function validateForm(
  formData: Record<string, any>,
  validationSchema: Record<string, Record<string, any>>,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const fieldName in validationSchema) {
    const rules = validationSchema[fieldName]
    const value = formData[fieldName]
    const error = validateField(value, rules)
    if (error) {
      errors[fieldName] = error
    }
  }

  return errors
}
