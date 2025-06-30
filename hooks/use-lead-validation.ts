"use client"
import { useState, useCallback } from "react"

// Define a type for the form data structure
interface LeadFormData {
  email: string
  first_name: string
  last_name: string
  phone?: string
  form_type: "waitlist" | "schedule" | "report"
  contact_time?: string
  issue_snapshot?: string
  mailing_list_consent?: boolean
  // Add other fields as they become relevant for validation
}

// Define a type for validation errors
type LeadFormErrors = {
  [key in keyof LeadFormData]?: string
}

export function useLeadValidation() {
  const [errors, setErrors] = useState<LeadFormErrors>({})

  const validateField = useCallback((fieldName: keyof LeadFormData, value: any): string | undefined => {
    switch (fieldName) {
      case "email":
        if (!value || value.trim() === "") {
          return "Email is required."
        }
        if (!/\S+@\S+\.\S+/.test(value)) {
          return "Invalid email format."
        }
        break
      case "first_name":
        if (!value || value.trim() === "") {
          return "First name is required."
        }
        break
      case "last_name":
        if (!value || value.trim() === "") {
          return "Last name is required."
        }
        break
      case "phone":
        if (value && !/^\+?[0-9\s\-()]{7,20}$/.test(value)) {
          // Basic phone number regex
          return "Invalid phone number format."
        }
        break
      case "form_type":
        if (!value || !["waitlist", "schedule", "report"].includes(value)) {
          return "Invalid form type."
        }
        break
      case "contact_time":
        // Add specific validation for contact_time if needed (e.g., time format)
        break
      case "issue_snapshot":
        if (value && value.length > 500) {
          return "Issue snapshot cannot exceed 500 characters."
        }
        break
      // Add validation for other fields as they are added to LeadFormData
      default:
        break
    }
    return undefined // No error
  }, [])

  const validateForm = useCallback(
    (formData: LeadFormData): boolean => {
      let isValid = true
      const newErrors: LeadFormErrors = {}

      // Validate all required fields
      const requiredFields: Array<keyof LeadFormData> = ["email", "first_name", "last_name", "form_type"]
      requiredFields.forEach((field) => {
        const error = validateField(field, formData[field])
        if (error) {
          newErrors[field] = error
          isValid = false
        }
      })

      // Validate optional fields if they are present
      if (formData.phone !== undefined) {
        const error = validateField("phone", formData.phone)
        if (error) {
          newErrors.phone = error
          isValid = false
        }
      }
      if (formData.issue_snapshot !== undefined) {
        const error = validateField("issue_snapshot", formData.issue_snapshot)
        if (error) {
          newErrors.issue_snapshot = error
          isValid = false
        }
      }
      // Add checks for other optional fields

      setErrors(newErrors)
      return isValid
    },
    [validateField],
  )

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  return { errors, validateField, validateForm, clearErrors }
}
