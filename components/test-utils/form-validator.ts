export interface ValidationRule {
  field: string
  type: "required" | "email" | "minLength" | "maxLength" | "pattern" | "custom"
  value?: any
  message: string
  validator?: (value: any) => boolean
}

export interface FormTestConfig {
  formId: string
  name: string
  fields: ValidationRule[]
  submitEndpoint?: string
  requiredConsents?: string[]
}

export class FormValidator {
  private config: FormTestConfig

  constructor(config: FormTestConfig) {
    this.config = config
  }

  validateField(fieldName: string, value: any): { isValid: boolean; message?: string } {
    const rule = this.config.fields.find((f) => f.field === fieldName)
    if (!rule) return { isValid: true }

    switch (rule.type) {
      case "required":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return { isValid: false, message: rule.message }
        }
        break

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value)) {
          return { isValid: false, message: rule.message }
        }
        break

      case "minLength":
        if (value && value.length < rule.value) {
          return { isValid: false, message: rule.message }
        }
        break

      case "maxLength":
        if (value && value.length > rule.value) {
          return { isValid: false, message: rule.message }
        }
        break

      case "pattern":
        if (value && !rule.value.test(value)) {
          return { isValid: false, message: rule.message }
        }
        break

      case "custom":
        if (rule.validator && value && !rule.validator(value)) {
          return { isValid: false, message: rule.message }
        }
        break
    }

    return { isValid: true }
  }

  validateForm(formData: Record<string, any>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    for (const rule of this.config.fields) {
      const result = this.validateField(rule.field, formData[rule.field])
      if (!result.isValid && result.message) {
        errors[rule.field] = result.message
      }
    }

    // Check required consents
    if (this.config.requiredConsents) {
      for (const consent of this.config.requiredConsents) {
        if (!formData[consent]) {
          errors[consent] = `${consent} is required`
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

// Predefined form configurations
export const FORM_CONFIGS: FormTestConfig[] = [
  {
    formId: "lead-capture",
    name: "Lead Capture Form",
    fields: [
      { field: "firstName", type: "required", message: "First name is required" },
      { field: "lastName", type: "required", message: "Last name is required" },
      { field: "email", type: "required", message: "Email is required" },
      { field: "email", type: "email", message: "Please enter a valid email address" },
      { field: "selectedForm", type: "required", message: "Please select what you'd like to do" },
    ],
    requiredConsents: ["mailingListConsent"],
  },
  {
    formId: "waitlist",
    name: "Waitlist Form",
    fields: [
      { field: "email", type: "required", message: "Email is required" },
      { field: "email", type: "email", message: "Please enter a valid email address" },
    ],
  },
  {
    formId: "report",
    name: "Full Report Form",
    fields: [
      { field: "firstName", type: "required", message: "First name is required" },
      { field: "lastName", type: "required", message: "Last name is required" },
      { field: "email", type: "required", message: "Email is required" },
      { field: "email", type: "email", message: "Please enter a valid email address" },
      { field: "narrative", type: "required", message: "Please describe what happened" },
      { field: "desiredOutcome", type: "required", message: "Desired outcome is required" },
      { field: "referralSource", type: "required", message: "Please tell us how you heard about us" },
    ],
    requiredConsents: ["dcwpConsent", "proxyConsent", "mailingListConsent"],
  },
]
