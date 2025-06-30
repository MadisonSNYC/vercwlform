"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReportFormSchema } from "@/components/test-utils/form-validator"
import type { z } from "zod"
import type { FormType } from "@/lib/constants"
import { submitFareReport } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export type ReportFormValues = z.infer<typeof ReportFormSchema>

interface ReportFormData {
  formType: FormType | ""
  email: string // Original email from lead form
  contactTime: string
  issueSnapshot: string
  hasStreetEasyListing: boolean
  streetEasyLink: string
  manualAddress: string
  borough: string
  neighborhood: string
  manualUnit: string
  manualPrice: string
  manualBedrooms: string
  manualBathrooms: string
  contactedBusiness: boolean
  employeeName: string
  whatHappened: string
  outcome: string
  landlordName: { name: string; company: string }[]
  brokerName: { name: string; company: string; phone: string; email: string }[]
  brokerageName: { name: string; address: string; phone: string; email: string }[]
  violations: string[]
  violationOtherTexts: Record<string, string>
  narrative: string
  additionalContext: string
  desiredOutcome: string
  desiredOutcomeOther: string
  firstName: string
  lastName: string
  userEmail: string // Email used in the report form, pre-filled from lead
  userPhone: string // Phone used in the report form, pre-filled from lead
  preferredContact: string
  isVeteran: boolean
  dcwpConsent: boolean
  proxyConsent: boolean
  mailingListConsent: boolean
  submitted: boolean
  referralSource: string
  referralSourceOther: string
  interests: string[]
  homeAddress: string
  address: string
  unit: string
  rent: string
  moveInDate: string
  leaseTerm: string
  feeAmount: string
  feeDescription: string
  paymentMethod: string
  proofOfPayment: string
  communicationRecords: string
  additionalInfo: string
  reporterName: string
  reporterEmail: string
  incidentDate: Date | undefined
  incidentTime: string
  location: string
  fareAmount: number
  description: string
  contactPermission: boolean
}

export const useReportForm = (
  initialLeadData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    selectedForm: FormType | ""
    mailingListConsent: boolean
  },
  onSubmitSuccess: () => void,
) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      formType: initialLeadData.selectedForm || "",
      email: initialLeadData.email || "", // Original email from lead form
      contactTime: "",
      issueSnapshot: "",
      hasStreetEasyListing: true,
      streetEasyLink: "",
      manualAddress: "",
      borough: "Manhattan", // Default value
      neighborhood: "",
      manualUnit: "",
      manualPrice: "",
      manualBedrooms: "",
      manualBathrooms: "",
      contactedBusiness: false,
      employeeName: "",
      whatHappened: "",
      outcome: "",
      landlordName: [{ name: "", company: "" }],
      brokerName: [{ name: "", company: "", phone: "", email: "" }],
      brokerageName: [{ name: "", address: "", phone: "", email: "" }],
      violations: [],
      violationOtherTexts: {},
      narrative: "",
      additionalContext: "",
      desiredOutcome: "",
      desiredOutcomeOther: "",
      firstName: initialLeadData.firstName || "",
      lastName: initialLeadData.lastName || "",
      userEmail: initialLeadData.email || "", // Pre-fill userEmail from lead
      userPhone: initialLeadData.phone || "", // Pre-fill userPhone from lead
      preferredContact: "",
      isVeteran: false,
      dcwpConsent: false,
      proxyConsent: false,
      mailingListConsent: initialLeadData.mailingListConsent || false, // Pre-fill consent
      submitted: false,
      referralSource: "",
      referralSourceOther: "",
      interests: [],
      homeAddress: "",
      address: "",
      unit: "",
      rent: "",
      moveInDate: "",
      leaseTerm: "",
      feeAmount: "",
      feeDescription: "",
      paymentMethod: "",
      proofOfPayment: "",
      communicationRecords: "",
      additionalInfo: "",
      reporterName: "",
      reporterEmail: "",
      incidentDate: new Date(),
      incidentTime: "",
      location: "",
      fareAmount: 0,
      description: "",
      contactPermission: false,
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = form

  const [formData, setFormData] = useState<ReportFormData>({
    formType: initialLeadData.selectedForm || "",
    email: initialLeadData.email || "", // Original email from lead form
    contactTime: "",
    issueSnapshot: "",
    hasStreetEasyListing: true,
    streetEasyLink: "",
    manualAddress: "",
    borough: "Manhattan", // Default value
    neighborhood: "",
    manualUnit: "",
    manualPrice: "",
    manualBedrooms: "",
    manualBathrooms: "",
    contactedBusiness: false,
    employeeName: "",
    whatHappened: "",
    outcome: "",
    landlordName: [{ name: "", company: "" }],
    brokerName: [{ name: "", company: "", phone: "", email: "" }],
    brokerageName: [{ name: "", address: "", phone: "", email: "" }],
    violations: [],
    violationOtherTexts: {},
    narrative: "",
    additionalContext: "",
    desiredOutcome: "",
    desiredOutcomeOther: "",
    firstName: initialLeadData.firstName || "",
    lastName: initialLeadData.lastName || "",
    userEmail: initialLeadData.email || "", // Pre-fill userEmail from lead
    userPhone: initialLeadData.phone || "", // Pre-fill userPhone from lead
    preferredContact: "",
    isVeteran: false,
    dcwpConsent: false,
    proxyConsent: false,
    mailingListConsent: initialLeadData.mailingListConsent || false, // Pre-fill consent
    submitted: false,
    referralSource: "",
    referralSourceOther: "",
    interests: [],
    homeAddress: "",
    address: "",
    unit: "",
    rent: "",
    moveInDate: "",
    leaseTerm: "",
    feeAmount: "",
    feeDescription: "",
    paymentMethod: "",
    proofOfPayment: "",
    communicationRecords: "",
    additionalInfo: "",
    reporterName: "",
    reporterEmail: "",
    incidentDate: new Date(),
    incidentTime: "",
    location: "",
    fareAmount: 0,
    description: "",
    contactPermission: false,
  })

  // Update form data when initialLeadData changes (e.g., when lead form is submitted)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      formType: initialLeadData.selectedForm || prev.formType,
      email: initialLeadData.email || prev.email,
      firstName: initialLeadData.firstName || prev.firstName,
      lastName: initialLeadData.lastName || prev.lastName,
      userEmail: initialLeadData.email || prev.userEmail,
      userPhone: initialLeadData.phone || prev.userPhone,
      mailingListConsent: initialLeadData.mailingListConsent || prev.mailingListConsent,
    }))
  }, [initialLeadData])

  const handleInputChange = useCallback(
    (field: keyof ReportFormData, value: any) => {
      setValue(field, value)
      // Clear error for the specific field when it changes
      if (errors[field]) {
        form.setError(field, { message: "" })
      }
    },
    [errors, setValue, form],
  )

  const handleViolationToggle = useCallback(
    (violation: string) => {
      const currentViolations = getValues("violations") || []
      const newViolations = currentViolations.includes(violation)
        ? currentViolations.filter((v) => v !== violation)
        : [...currentViolations, violation]
      setValue("violations", newViolations)
      if (errors.violations) {
        form.setError("violations", { message: "" })
      }
    },
    [errors, setValue, getValues, form],
  )

  const handleOtherViolationText = useCallback(
    (category: string, text: string) => {
      setValue(`violationOtherTexts.${category}`, text)
    },
    [setValue],
  )

  const addLandlord = useCallback(() => {
    const currentLandlords = getValues("landlordName") || []
    setValue("landlordName", [...currentLandlords, { name: "", company: "" }])
    if (errors.landlordName) {
      form.setError("landlordName", { message: "" })
    }
  }, [errors, setValue, getValues, form])

  const removeLandlord = useCallback(
    (index: number) => {
      const currentLandlords = getValues("landlordName") || []
      setValue(
        "landlordName",
        currentLandlords.filter((_, i) => i !== index),
      )
    },
    [setValue, getValues],
  )

  const updateLandlord = useCallback(
    (index: number, field: keyof (typeof formData.landlordName)[0], value: string) => {
      const currentLandlords = getValues("landlordName") || []
      const newLandlords = [...currentLandlords]
      newLandlords[index] = { ...newLandlords[index], [field]: value }
      setValue("landlordName", newLandlords)
      if (errors.landlordName) {
        form.setError("landlordName", { message: "" })
      }
    },
    [errors, setValue, getValues, form],
  )

  const addBroker = useCallback(() => {
    const currentBrokers = getValues("brokerName") || []
    setValue("brokerName", [...currentBrokers, { name: "", company: "", phone: "", email: "" }])
    if (errors.brokerName) {
      form.setError("brokerName", { message: "" })
    }
  }, [errors, setValue, getValues, form])

  const removeBroker = useCallback(
    (index: number) => {
      const currentBrokers = getValues("brokerName") || []
      setValue(
        "brokerName",
        currentBrokers.filter((_, i) => i !== index),
      )
    },
    [setValue, getValues],
  )

  const updateBroker = useCallback(
    (index: number, field: keyof (typeof formData.brokerName)[0], value: string) => {
      const currentBrokers = getValues("brokerName") || []
      const newBrokers = [...currentBrokers]
      newBrokers[index] = { ...newBrokers[index], [field]: value }
      setValue("brokerName", newBrokers)
      if (errors.brokerName) {
        form.setError("brokerName", { message: "" })
      }
    },
    [errors, setValue, getValues, form],
  )

  const addBrokerage = useCallback(() => {
    const currentBrokerages = getValues("brokerageName") || []
    setValue("brokerageName", [...currentBrokerages, { name: "", address: "", phone: "", email: "" }])
    if (errors.brokerageName) {
      form.setError("brokerageName", { message: "" })
    }
  }, [errors, setValue, getValues, form])

  const removeBrokerage = useCallback(
    (index: number) => {
      const currentBrokerages = getValues("brokerageName") || []
      setValue(
        "brokerageName",
        currentBrokerages.filter((_, i) => i !== index),
      )
    },
    [setValue, getValues],
  )

  const updateBrokerage = useCallback(
    (index: number, field: keyof (typeof formData.brokerageName)[0], value: string) => {
      const currentBrokerages = getValues("brokerageName") || []
      const newBrokerages = [...currentBrokerages]
      newBrokerages[index] = { ...newBrokerages[index], [field]: value }
      setValue("brokerageName", newBrokerages)
      if (errors.brokerageName) {
        form.setError("brokerageName", { message: "" })
      }
    },
    [errors, setValue, getValues, form],
  )

  const onSubmit = useCallback(
    async (values: ReportFormValues) => {
      setIsSubmitting(true)
      const result = await submitFareReport(values)
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })
        onSubmitSuccess()
        reset() // Reset form on success
      } else {
        toast({
          title: "Error!",
          description: result.message,
          variant: "destructive",
        })
        console.error("Form submission error:", result.errors)
      }
      setIsSubmitting(false)
    },
    [reset, onSubmitSuccess, toast],
  )

  return {
    ...form,
    formData,
    handleInputChange,
    handleViolationToggle,
    handleOtherViolationText,
    addLandlord,
    removeLandlord,
    updateLandlord,
    addBroker,
    removeBroker,
    updateBroker,
    addBrokerage,
    removeBrokerage,
    updateBrokerage,
    onSubmit,
    isSubmitting,
  }
}
