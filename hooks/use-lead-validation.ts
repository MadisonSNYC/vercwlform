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
  narrative?: string
  // Add other fields as they become relevant for validation
}

// Define a type for validation errors
type LeadFormErrors = {
  [key: string]: string
}

export function useLeadValidation() {
  const [errors, setErrors] = useState<LeadFormErrors>({})

  const validateField = useCallback((fieldName: string, value: any): string | undefined => {
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
      case "firstName":
        if (!value || value.trim() === "") {
          return "First name is required."
        }
        break
      case "last_name":
      case "lastName":
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
      case "narrative":
        if (!value || value.trim() === "") {
          return "Narrative is required."
        }
        break
      // Add validation for other fields as they are added to LeadFormData
      default:
        break
    }
    return undefined // No error
  }, [])

  const validateLeadForm = useCallback(
    (formData: any) => {
      const newErrors: LeadFormErrors = {}
      if (!formData.email) newErrors.email = "Email is required."
      if (!formData.firstName) newErrors.firstName = "First Name is required."
      if (!formData.lastName) newErrors.lastName = "Last Name is required."
      // Add more specific validations as needed
      setErrors(newErrors)
      return newErrors
    },
    [validateField],
  )

  const validateReportForm = useCallback(
    (formData: any) => {
      const newErrors: LeadFormErrors = {}
      if (!formData.email) newErrors.email = "Email is required."
      if (!formData.firstName) newErrors.firstName = "First Name is required."
      if (!formData.lastName) newErrors.lastName = "Last Name is required."
      if (!formData.narrative) newErrors.narrative = "Narrative is required."
      // Add more specific validations for report form fields
      setErrors(newErrors)
      return newErrors
    },
    [validateField],
  )

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  return { errors, validateField, validateLeadForm, validateReportForm, clearErrors }
}
