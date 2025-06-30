"use client"

import type React from "react"

import { useState, useEffect, useMemo, startTransition } from "react"
import { AlertCircle, Building, MapPin, Mail, Calendar, FileText, Shield, Zap } from "lucide-react"
import { submitFareReport } from "@/lib/actions" // Corrected import
import { useActionState } from "react"
import { useLeadValidation } from "@/hooks/use-lead-validation"
import Image from "next/image"

// Define a comprehensive type for the entire form state
interface FullFormState {
  // Lead Capture (Page 1)
  firstName: string
  lastName: string
  email: string
  phone: string
  referralSource: string
  referralSourceOther: string
  mailingListConsent: boolean

  // Tester Opt-In (Section A)
  selectedFormType: "report" | "schedule" | "waitlist" | ""

  // Live Report Form (Section B)
  propertyInfoType: "streeteasy" | "manual" | ""
  streetEasyLink: string
  manualAddress: string
  manualPrice: string
  manualUnit: string
  manualBedrooms: string
  manualBathrooms: string
  borough: string
  neighborhood: string

  whoReporting: "management" | "agent" | "brokerage" | ""
  managementCompanyName: string
  agentFirstName: string
  agentLastName: string
  brokerageName: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  businessWebsite: string
  businessLicense: string
  brokerageForAgent: string

  contactedBusiness: boolean
  employeeName: string
  samePersonAsBusiness: boolean
  whatHappened: string
  outcome: string
  outcomeChips: string[]
  outcomeOtherText: string

  violations: string[]
  violationOtherTexts: Record<string, string>

  // DCWP Fee Details (enhanced with checkbox functionality)
  illegalBrokerFeeCharged: boolean | null
  requirementToUseBroker: boolean | null
  feesNotDisclosed: boolean | null
  feesNotDisclosedText: string
  improperFeesInAd: boolean | null
  improperFeesInAdUrl: string

  // New fee charges with checkbox functionality
  feeCharges: string[]
  feeChargesOther: string

  documentUpload: File[]
  aiRefinementOption: "none" | "refine" | "refine-and-email"
  reportDescription: string
  narrative: string
  additionalNotes: string
  desiredOutcome: string[]
  desiredOutcomeOther: string

  // Complainant Information
  userEmail: string
  userPhone: string
  preferredContact: "email" | "phone" | ""
  isVeteran: boolean

  // Review & Submit
  resendReportToMe: boolean
  dcwpConsent: boolean
  proxyConsent: boolean

  // Schedule Your Report Later (Section C)
  bestTimeToReachYou: "morning" | "afternoon" | "evening" | ""
  briefIssueSnapshot: string

  // Submission status
  submitted: boolean
}

const violationCategories = {
  listing: [
    "Bait-and-Switch Listing",
    "Misleading Photos/Amenities",
    "No-Fee Ad That Added a Fee",
    "Undisclosed Mandatory Fees",
    "Discriminatory Practice (e.g. 'No Section 8,' voucher steering)",
    "Other",
  ],
  fee: [
    "Illegal Broker/Agent Fee",
    "Requirement to Use a Broker/Agent (forced to sign tenant agreement)",
    "Excessive App/Processing Fee (> $20)",
    "Good-Faith/Holding Deposit",
    "Illicit Security Deposit (> 1× rent)",
    "Cash-Only or Personal Payment Request",
    "Other",
  ],
  "agent-landlord-behavior": [
    "High-Pressure Sales Tactics",
    "Retaliation When Questioned",
    "Misrepresentation of Law or Exemptions",
    "Other",
  ],
}

// Fee charges options for checkbox functionality
const feeChargeOptions = [
  "Broker Fee",
  "Application Fee > $20",
  "Security Deposit > 1 month rent",
  "Good Faith Deposit",
  "Processing Fee",
  "Administrative Fee",
  "Background Check Fee > $20",
  "Credit Check Fee > $20",
  "Other",
]

export default function NYCFAREReporter() {
  const [scrollY, setScrollY] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [submitState, submitAction, isPending] = useActionState(submitFareReport, null)
  const [thankYouMessage, setThankYouMessage] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const [formData, setFormData] = useState<FullFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    referralSource: "",
    referralSourceOther: "",
    mailingListConsent: false,
    selectedFormType: "",
    propertyInfoType: "",
    streetEasyLink: "",
    manualAddress: "",
    manualPrice: "",
    manualUnit: "",
    manualBedrooms: "",
    manualBathrooms: "",
    borough: "",
    neighborhood: "",
    whoReporting: "",
    managementCompanyName: "",
    agentFirstName: "",
    agentLastName: "",
    brokerageName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    businessWebsite: "",
    businessLicense: "",
    brokerageForAgent: "",
    contactedBusiness: false,
    employeeName: "",
    samePersonAsBusiness: false,
    whatHappened: "",
    outcome: "",
    outcomeChips: [],
    outcomeOtherText: "",
    violations: [],
    violationOtherTexts: {},
    illegalBrokerFeeCharged: null,
    requirementToUseBroker: null,
    feesNotDisclosed: null,
    feesNotDisclosedText: "",
    improperFeesInAd: null,
    improperFeesInAdUrl: "",
    feeCharges: [],
    feeChargesOther: "",
    documentUpload: [],
    aiRefinementOption: "refine",
    reportDescription: "",
    narrative: "",
    additionalNotes: "",
    desiredOutcome: [],
    desiredOutcomeOther: "",
    userEmail: "",
    userPhone: "",
    preferredContact: "",
    isVeteran: false,
    resendReportToMe: false,
    dcwpConsent: false,
    proxyConsent: false,
    submitted: false,
    bestTimeToReachYou: "",
    briefIssueSnapshot: "",
  })

  const {
    errors: leadErrors,
    validateField: validateLeadField,
    validateAll: validateAllLeadFields,
    clearErrors: clearLeadErrors,
    clearFieldError: clearLeadFieldError,
    hasErrors: hasLeadErrors,
  } = useLeadValidation()

  // Effect for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effect for server action results
  useEffect(() => {
    if (submitState?.success) {
      setThankYouMessage(submitState.success)
      setCurrentStep(2)
      scrollToSection("confirmation")
    } else if (submitState?.error) {
      console.error("Server action error:", submitState.error)
      alert(`Submission failed: ${submitState.error}`)
    }
  }, [submitState])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (field: keyof FullFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (currentStep === 0 && leadErrors[field as keyof typeof leadErrors]) {
      clearLeadFieldError(field as keyof typeof leadErrors)
    }
  }

  const handleViolationToggle = (violation: string) => {
    setFormData((prev) => ({
      ...prev,
      violations: prev.violations.includes(violation)
        ? prev.violations.filter((v) => v !== violation)
        : [...prev.violations, violation],
    }))
  }

  const handleDesiredOutcomeToggle = (outcome: string) => {
    setFormData((prev) => ({
      ...prev,
      desiredOutcome: prev.desiredOutcome.includes(outcome)
        ? prev.desiredOutcome.filter((o) => o !== outcome)
        : [...prev.desiredOutcome, outcome],
    }))
  }

  const handleOutcomeChipToggle = (chip: string) => {
    setFormData((prev) => ({
      ...prev,
      outcomeChips: prev.outcomeChips.includes(chip)
        ? prev.outcomeChips.filter((c) => c !== chip)
        : [...prev.outcomeChips, chip],
    }))
  }

  const handleOtherViolationText = (category: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      violationOtherTexts: {
        ...prev.violationOtherTexts,
        [category]: text,
      },
    }))
  }

  // New function to handle fee charges toggle
  const handleFeeChargeToggle = (charge: string) => {
    setFormData((prev) => ({
      ...prev,
      feeCharges: prev.feeCharges.includes(charge)
        ? prev.feeCharges.filter((c) => c !== charge)
        : [...prev.feeCharges, charge],
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleLeadCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const leadDataForValidation = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      selectedForm: formData.selectedFormType,
    }

    const isValid = validateAllLeadFields(leadDataForValidation)

    if (!isValid || !formData.mailingListConsent) {
      if (!formData.mailingListConsent) {
        alert("You must agree to receive updates to proceed.")
      }
      return
    }

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "lead_capture", {
        event_category: "engagement",
        event_label: formData.selectedFormType,
        value: 1,
      })
    }
    console.log(`Lead captured: ${formData.email} for ${formData.selectedFormType}`)

    setFormData((prev) => ({
      ...prev,
      userEmail: prev.email,
      userPhone: prev.phone,
    }))

    if (formData.selectedFormType === "waitlist") {
      const submitFormData = new FormData()
      submitFormData.append("formType", "waitlist")
      submitFormData.append("email", formData.email)
      submitFormData.append("firstName", formData.firstName)
      submitFormData.append("lastName", formData.lastName)
      submitFormData.append("phone", formData.phone)
      submitFormData.append("mailingListConsent", formData.mailingListConsent ? "on" : "off")
      startTransition(async () => {
        await submitAction(submitFormData)
      })
    } else {
      setCurrentStep(1)
      setTimeout(() => {
        scrollToSection("report-flow-start")
      }, 100)
    }
  }

  const handleCombinedFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Record<string, string> = {}

    if (formData.selectedFormType === "report") {
      if (!formData.propertyInfoType) errors.propertyInfoType = "Property information is required"
      if (formData.propertyInfoType === "streeteasy" && !formData.streetEasyLink.trim()) {
        errors.streetEasyLink = "StreetEasy URL is required"
      }
      if (formData.propertyInfoType === "manual" && !formData.manualAddress.trim()) {
        errors.manualAddress = "Manual address is required"
      }

      if (!formData.whoReporting) errors.whoReporting = "Who you are reporting is required"
      if (formData.whoReporting === "management" && !formData.managementCompanyName.trim()) {
        errors.managementCompanyName = "Management company name is required"
      } else if (formData.whoReporting === "agent") {
        if (!formData.agentFirstName.trim()) errors.agentFirstName = "Agent first name is required"
        if (!formData.agentLastName.trim()) errors.agentLastName = "Agent last name is required"
        if (!formData.brokerageForAgent.trim()) errors.brokerageForAgent = "Brokerage for agent is required"
      } else if (formData.whoReporting === "brokerage" && !formData.brokerageName.trim()) {
        errors.brokerageName = "Brokerage name is required"
      }

      if (formData.violations.length === 0) errors.violations = "At least one violation must be selected"
      if (!formData.narrative.trim()) errors.narrative = "Please describe what happened"
      if (formData.desiredOutcome.length === 0) errors.desiredOutcome = "Desired outcome is required"
      if (!formData.referralSource.trim()) errors.referralSource = "How you found us is required"

      if (!formData.firstName.trim()) errors.firstName = "First name is required"
      if (!formData.lastName.trim()) errors.lastName = "Last name is required"
      if (!formData.userEmail.trim()) errors.userEmail = "Email is required"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
        errors.userEmail = "Please enter a valid email address"
      }
      if (!formData.preferredContact) errors.preferredContact = "Preferred contact method is required"

      if (!formData.dcwpConsent) errors.dcwpConsent = "DCWP consent is required"
      if (!formData.proxyConsent) errors.dcwpConsent = "Proxy submission consent is required"
      if (!formData.mailingListConsent) errors.mailingListConsent = "Mailing list consent is required"
    } else if (formData.selectedFormType === "schedule") {
      if (!formData.userEmail.trim()) errors.userEmail = "Email is required"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
        errors.userEmail = "Please enter a valid email address"
      }
      if (!formData.bestTimeToReachYou) errors.bestTimeToReachYou = "Best time to reach you is required"
    }

    if (Object.keys(errors).length > 0) {
      alert("Please fill in all required fields and correct errors:\n" + Object.values(errors).join("\n"))
      console.error("Client-side validation errors:", errors)
      return
    }

    const submitFormData = new FormData()
    submitFormData.append("formType", formData.selectedFormType)
    submitFormData.append("email", formData.userEmail)

    if (formData.selectedFormType === "report") {
      submitFormData.append("firstName", formData.firstName)
      submitFormData.append("lastName", formData.lastName)
      submitFormData.append("phone", formData.userPhone)
      submitFormData.append("preferredContact", formData.preferredContact)
      submitFormData.append("isVeteran", formData.isVeteran ? "on" : "off")

      submitFormData.append("hasStreetEasyListing", formData.propertyInfoType === "streeteasy" ? "on" : "off")
      if (formData.propertyInfoType === "streeteasy") {
        submitFormData.append("streetEasyLink", formData.streetEasyLink)
      } else if (formData.propertyInfoType === "manual") {
        submitFormData.append("manualAddress", formData.manualAddress)
        submitFormData.append("manualPrice", formData.manualPrice)
        submitFormData.append("manualUnit", formData.manualUnit)
        submitFormData.append("manualBedrooms", formData.manualBedrooms)
        submitFormData.append("manualBathrooms", formData.manualBathrooms)
      }
      submitFormData.append("borough", formData.borough)
      submitFormData.append("neighborhood", formData.neighborhood)

      submitFormData.append("contactedBusiness", formData.contactedBusiness ? "on" : "off")
      submitFormData.append("employeeName", formData.employeeName)
      submitFormData.append("whatHappened", formData.whatHappened)
      submitFormData.append("outcome", formData.outcome)

      if (formData.whoReporting === "management") {
        submitFormData.append("landlordName", formData.managementCompanyName)
        submitFormData.append("landlordCompany", formData.managementCompanyName)
      } else if (formData.whoReporting === "agent") {
        submitFormData.append("brokerName", `${formData.agentFirstName} ${formData.agentLastName}`)
        submitFormData.append("brokerCompany", formData.brokerageForAgent)
      } else if (formData.whoReporting === "brokerage") {
        submitFormData.append("brokerageName", formData.brokerageName)
      }

      if (formData.businessAddress.trim()) {
        submitFormData.append("businessAddress", formData.businessAddress)
      }

      submitFormData.append("violations", JSON.stringify(formData.violations))
      submitFormData.append("violation_others", JSON.stringify(formData.violationOtherTexts))

      submitFormData.append("narrative", formData.narrative)
      submitFormData.append("additionalContext", formData.additionalNotes)
      submitFormData.append("desired_outcome_array", JSON.stringify(formData.desiredOutcome))
      submitFormData.append("desired_outcome_other", formData.desiredOutcomeOther)
      submitFormData.append("referralSource", formData.referralSource)
      submitFormData.append("referralSourceOther", formData.referralSourceOther)

      submitFormData.append("dcwpConsent", formData.dcwpConsent ? "on" : "off")
      submitFormData.append("proxyConsent", formData.proxyConsent ? "on" : "off")
      submitFormData.append("mailingListConsent", formData.mailingListConsent ? "on" : "off")

      // DCWP Fee Details
      if (formData.illegalBrokerFeeCharged !== null)
        submitFormData.append("illegalBrokerFeeCharged", formData.illegalBrokerFeeCharged ? "on" : "off")
      if (formData.requirementToUseBroker !== null)
        submitFormData.append("requirementToUseBroker", formData.requirementToUseBroker ? "on" : "off")
      if (formData.feesNotDisclosed !== null) {
        submitFormData.append("feesNotDisclosed", formData.feesNotDisclosed ? "on" : "off")
        submitFormData.append("feesNotDisclosedText", formData.feesNotDisclosedText)
      }
      if (formData.improperFeesInAd !== null) {
        submitFormData.append("improperFeesInAd", formData.improperFeesInAd ? "on" : "off")
        submitFormData.append("improperFeesInAdUrl", formData.improperFeesInAdUrl)
      }

      // Fee charges
      submitFormData.append("fee_charges", JSON.stringify(formData.feeCharges))
      if (formData.feeChargesOther.trim()) {
        submitFormData.append("fee_charges_other", formData.feeChargesOther)
      }

      submitFormData.append("aiRefinementOption", formData.aiRefinementOption)
      if (formData.aiRefinementOption !== "none") {
        submitFormData.append("reportDescription", formData.reportDescription)
      }

      // Handle file uploads
      const documentInfo = selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }))
      submitFormData.append("document_info", JSON.stringify(documentInfo))
      selectedFiles.forEach((file, index) => {
        submitFormData.append(`document_${index}`, file)
      })
    } else if (formData.selectedFormType === "schedule") {
      submitFormData.append("contactTime", formData.bestTimeToReachYou)
      submitFormData.append("issueSnapshot", formData.briefIssueSnapshot)
      submitFormData.append("firstName", formData.firstName)
      submitFormData.append("lastName", formData.lastName)
      submitFormData.append("phone", formData.userPhone)
      submitFormData.append("mailingListConsent", formData.mailingListConsent ? "on" : "off")
    }

    startTransition(async () => {
      await submitAction(submitFormData)
    })
  }

  const commonInputClasses =
    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
  const errorInputClasses = "border-red-500 bg-red-50"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2"
  const errorTextClasses = "mt-1 text-sm text-red-600"

  const referralSources = [
    "Instagram",
    "TikTok",
    "LinkedIn",
    "Word of mouth",
    "Google search",
    "News article",
    "Reddit",
    "Other",
  ]
  const desiredOutcomes = ["DCWP Investigation", "Enforce fee cap", "Full refund", "Confirm no-fee compliance", "Other"]
  const contactTimes = ["morning", "afternoon", "evening"]
  const preferredContactMethods = ["email", "phone"]

  const isReportFormValid = useMemo(() => {
    if (formData.selectedFormType !== "report") return true

    const commonRequiredFields = [
      formData.propertyInfoType,
      formData.whoReporting,
      formData.narrative,
      formData.referralSource,
      formData.firstName,
      formData.lastName,
      formData.userEmail,
      formData.preferredContact,
    ]

    if (commonRequiredFields.some((field) => !field.trim())) return false

    if (formData.propertyInfoType === "streeteasy" && !formData.streetEasyLink.trim()) return false
    if (formData.propertyInfoType === "manual" && !formData.manualAddress.trim()) return false

    if (formData.whoReporting === "management" && !formData.managementCompanyName.trim()) return false
    if (formData.whoReporting === "agent") {
      if (!formData.agentFirstName.trim() || !formData.agentLastName.trim() || !formData.brokerageForAgent.trim())
        return false
    }
    if (formData.whoReporting === "brokerage" && !formData.brokerageName.trim()) return false

    if (formData.violations.length === 0) return false
    if (formData.desiredOutcome.length === 0) return false

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) return false

    if (!formData.dcwpConsent || !formData.proxyConsent || !formData.mailingListConsent) return false

    return true
  }, [formData])

  const isScheduleFormValid = useMemo(() => {
    if (formData.selectedFormType !== "schedule") return true

    const requiredFields = [formData.userEmail, formData.bestTimeToReachYou]

    if (requiredFields.some((field) => !field.trim())) return false
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) return false

    return true
  }, [formData])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"} border-b border-gray-200`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div
                className={`transition-all duration-300 ${scrollY > 50 ? "w-6 h-6" : "w-8 h-8"} bg-gradient-to-r from-orange-500 to-blue-600 rounded-full flex items-center justify-center`}
              >
                <Building className={`${scrollY > 50 ? "w-3 h-3" : "w-4 h-4"} text-white`} />
              </div>
              <span className={`ml-2 font-bold transition-all duration-300 ${scrollY > 50 ? "text-lg" : "text-xl"}`}>
                NYC FARE REPORTER
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("madison-story")}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Madison's Story
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("support-this-work")}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Support This Work
              </button>
            </div>
            <button
              onClick={() => scrollToSection("report-form")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              Join Beta
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-8 bg-[#FAFAF8] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="mb-8">
              <Image
                src="/hero-image.png"
                alt="Renters United - Stop illegal broker fees. Build collective power. AI-enhanced reporting for NYC tenant rights."
                className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
                width={1000}
                height={600}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-8 bg-[#1F2937]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => scrollToSection("report-form")}
            className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            BE A TESTER
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-[#FAFAF8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-200 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <div className="bg-gradient-to-r from-orange-50 via-white to-blue-50 border border-orange-200 shadow-xl p-8 rounded-2xl mb-12">
              <p className="text-2xl text-gray-800 italic mb-4 font-medium">
                "To build a public record of misconduct in NYC housing — empowering renters to push back, collectively
                and confidently."
              </p>
              <div className="text-sm text-gray-700 space-y-2">
                <p className="mb-2">
                  For questions, feedback, comments, please email:{" "}
                  <a
                    href="mailto:farereporter@thenycagent.com"
                    className="text-orange-600 hover:text-orange-700 underline font-semibold"
                  >
                    farereporter@thenycagent.com
                  </a>
                </p>
                <p>
                  <a
                    href="https://council.nyc.gov/chi-osse/the-fare-act/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 underline font-semibold"
                  >
                    Learn more about the FARE Act here
                  </a>
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mt-12">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Why NYC FARE Reporter Exists</h4>
              <p className="text-lg text-blue-800 leading-relaxed">
                A world where renters have the tools and data to push back against illegal practices. Where violations
                are tracked publicly, patterns are exposed, and bad actors face real consequences.
              </p>
            </div>
          </div>

          <div className="text-center mb-12 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-10 rounded-3xl border border-indigo-200 shadow-lg">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-8">Help Us Test & Launch</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're days away from launch and need your help testing the system. Join our beta program:
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, selectedFormType: "report" }))
                  scrollToSection("report-form")
                }}
                className="group p-8 border-2 border-[#FDD8B1] bg-[#FED7AA] rounded-2xl hover:bg-gradient-to-br hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-xl font-bold text-[#1E3A8A] mb-3">Test With Real Report</div>
                <div className="text-[#1E3A8A]">Have a violation? Help us test by filing it now</div>
              </button>

              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, selectedFormType: "schedule" }))
                  scrollToSection("report-form")
                }}
                className="group p-8 border-2 border-blue-300 bg-blue-200 rounded-2xl hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="text-xl font-bold text-[#1E3A8A] mb-3">Schedule My Test</div>
                <div className="text-[#1E3A8A]">We'll reach out to walk you through it</div>
              </button>

              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, selectedFormType: "waitlist" }))
                  scrollToSection("report-form")
                }}
                className="group p-8 border-2 border-orange-300 bg-orange-200 rounded-2xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-rose-100 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div className="text-xl font-bold text-[#1E3A8A] mb-3">Just Updates</div>
                <div className="text-[#1E3A8A]">Get notified when we officially launch</div>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-100 rounded-full opacity-50 blur-md"></div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-orange-200 rounded-lg opacity-50 blur-md"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why NYC FARE Reporter?</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  The FARE Act passed, but enforcement feels scattered. Renters still hear "it's standard," "it's part
                  of rent," or get ghosted when they question illegal fees.
                </p>
                <p>
                  The current reporting process is labyrinthine, emotional, and alienating. Many violations go
                  unreported because the system feels too complex.
                </p>
                <p className="text-lg font-bold text-[#1E3A8A]">
                  We're changing that. NYC FARE Reporter is a streamlined, AI-assisted toolkit that makes reporting
                  accessible, effective, and transparent.
                </p>
              </div>
            </div>
            <div className="bg-blue-100 p-8 rounded-lg relative md:border-l md:border-orange-300 md:pl-12">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-200 rounded-full opacity-50 blur-md"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-300 rounded-lg opacity-50 blur-md"></div>
              <h4 className="font-semibold text-[#1E3A8A] mb-4">What We're Building</h4>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <p>90-second AI-powered complaint form</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <p>Automatic submission to NYC DCWP & NYS DOS</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <p>Public dashboard showing violation patterns</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <p>StreetEasy pricing & inventory tracker</p>
                </div>
              </div>
              <p className="text-sm text-[#1E3A8A] mt-4 italic">
                Your identity stays private. The violators' behavior becomes public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#FAFAF8] relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-orange-100 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-blue-100 rounded-lg opacity-30 blur-xl z-0 rotate-45"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-30 blur-xl z-0"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-6">How It Works</h2>
            <p className="text-xl text-gray-600">File your FARE Act violation report in under 90 seconds</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-xl border-2 border-orange-200 shadow-md text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">1. Paste Your Listing</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Drop in a StreetEasy link. We automatically extract address, price, agent, brokerage, and fee info.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-xl border-2 border-blue-200 shadow-md text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">2. Check What Happened</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Select violations from our comprehensive list—even things you might not know were illegal.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-xl border-2 border-orange-200 shadow-md text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">3. AI Drafts & Submits</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our AI helps perfect your complaint narrative. We send it to authorities—you get CC'd on everything.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 backdrop-blur p-8 rounded-3xl border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center relative">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.05) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-orange-900 mb-4">AI-Enhanced Drafting</h4>
              <p className="text-orange-800 text-lg leading-relaxed">
                Rewrites complaints with clarity and legal precision
              </p>
              <div className="mt-6 pt-4 border-t border-orange-300">
                <div className="inline-block bg-orange-200 text-orange-900 px-4 py-2 rounded-full text-sm font-semibold">
                  ⚡ Powered by AI
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur p-8 rounded-3xl border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center relative">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-blue-900 mb-4">Direct Government Filing</h4>
              <p className="text-blue-800 text-lg leading-relaxed">
                Reports go straight to NYC DCWP and NYS Department of State
              </p>
              <div className="mt-6 pt-4 border-t border-blue-300">
                <div className="inline-block bg-blue-200 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold">
                  🏛️ Official Channels
                </div>
              </div>
            </div>

            <div className="group bg-[#FED7AA] backdrop-blur p-8 rounded-3xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center relative">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(254, 215, 170, 0.05) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Building className="w-8 h-8 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-[#1E3A8A] mb-4">Public Accountability</h4>
              <p className="text-[#1E3A8A] text-lg leading-relaxed">
                Anonymous data builds NYC's first public violation database
              </p>
              <div className="mt-6 pt-4 border-t border-purple-300">
                <div className="inline-block bg-purple-200 text-purple-900 px-4 py-2 rounded-full text-sm font-semibold">
                  📈 Public Accountability
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
