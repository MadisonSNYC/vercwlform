"use client"

import { useState, useCallback } from "react"

interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone?: string // Made phone optional
  selectedForm: string
}

interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  selectedForm?: string
  general?: string
}

export function useLeadValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = useCallback(
    (field: keyof LeadData, value: string) => {
      const newErrors = { ...errors }

      switch (field) {
        case "firstName":
          if (!(value ?? "").trim()) {
            // Added nullish coalescing
            newErrors.firstName = "First name is required"
          } else if ((value ?? "").trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters"
          } else {
            delete newErrors.firstName
          }
          break

        case "lastName":
          if (!(value ?? "").trim()) {
            // Added nullish coalescing
            newErrors.lastName = "Last name is required"
          } else if ((value ?? "").trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters"
          } else {
            delete newErrors.lastName
          }
          break

        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!(value ?? "").trim()) {
            // Added nullish coalescing
            newErrors.email = "Email is required"
          } else if (!emailRegex.test(value ?? "")) {
            // Added nullish coalescing
            newErrors.email = "Please enter a valid email address"
          } else {
            delete newErrors.email
          }
          break

        case "selectedForm":
          if (!value) {
            newErrors.selectedForm = "Please select what you'd like to do"
          } else {
            delete newErrors.selectedForm
          }
          break
      }

      setErrors(newErrors)
      return !newErrors[field]
    },
    [errors],
  )

  const validateAll = useCallback((data: LeadData) => {
    const newErrors: ValidationErrors = {}

    // Added nullish coalescing to ensure data.firstName is a string before calling trim()
    if (!(data.firstName ?? "").trim()) {
      newErrors.firstName = "First name is required"
    } else if ((data.firstName ?? "").trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    // Added nullish coalescing to ensure data.lastName is a string before calling trim()
    if (!(data.lastName ?? "").trim()) {
      newErrors.lastName = "Last name is required"
    } else if ((data.lastName ?? "").trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // Added nullish coalescing to ensure data.email is a string before calling trim()
    if (!(data.email ?? "").trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(data.email ?? "")) {
      // Added nullish coalescing
      newErrors.email = "Please enter a valid email address"
    }

    if (!data.selectedForm) {
      newErrors.selectedForm = "Please select what you'd like to do"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const clearFieldError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  return {
    errors,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0,
  }
}
