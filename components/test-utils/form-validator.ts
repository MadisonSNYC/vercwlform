// components/test-utils/form-validator.ts
export function validateForm(
  formData: Record<string, any>,
  rules: Record<string, (value: any) => string | null>,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const key in rules) {
    if (rules.hasOwnProperty(key)) {
      const rule = rules[key]
      const value = formData[key]
      const error = rule(value)
      if (error) {
        errors[key] = error
      }
    }
  }
  return errors
}

// Example validation rules
export const required = (value: any) =>
  value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)
    ? "This field is required."
    : null
export const isEmail = (value: string) =>
  value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email address." : null
export const minLength = (min: number) => (value: string) =>
  value && value.length < min ? `Must be at least ${min} characters.` : null
export const isNumeric = (value: string) => (value && !/^\d+$/.test(value) ? "Must be a number." : null)
