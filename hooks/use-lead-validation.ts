"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { validateField } from "@/components/test-utils/form-validator"

interface ValidationRules {
  [key: string]: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
    patternMessage?: string
    email?: boolean
    min?: number
    max?: number
    checked?: boolean
  }
}

interface FormErrors {
  [key: string]: string | null
}

export function useLeadValidation<T extends Record<string, any>>(initialData: T, validationSchema: ValidationRules) {
  const [formData, setFormData] = useState<T>(initialData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isTouched, setIsTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialData).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<keyof T, boolean>),
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }))
      setIsTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }))
    },
    [],
  )

  const handleSelectChange = useCallback((name: string, value: string | boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    setIsTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }))
  }, [])

  const validateForm = useCallback(() => {
    let isValid = true
    const newErrors: FormErrors = {}

    for (const key in validationSchema) {
      const value = formData[key]
      const rules = validationSchema[key]
      const error = validateField(value, rules)
      newErrors[key] = error
      if (error) {
        isValid = false
      }
    }
    setErrors(newErrors)
    return isValid
  }, [formData, validationSchema])

  const validateFieldOnBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement
      const fieldRules = validationSchema[name]
      if (fieldRules) {
        const fieldValue = type === "checkbox" ? checked : value
        const error = validateField(fieldValue, fieldRules)
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }))
      }
      setIsTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }))
    },
    [validationSchema],
  )

  // Validate all fields on initial load or when formData/validationSchema changes
  useEffect(() => {
    validateForm()
  }, [formData, validationSchema, validateForm]) // Added validateForm to dependencies

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    handleSelectChange,
    validateForm,
    isTouched,
    validateFieldOnBlur,
  }
}
