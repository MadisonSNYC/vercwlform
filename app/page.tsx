"use client"

import type React from "react"

import { useState, useEffect, useMemo, startTransition } from "react"
import {
  AlertCircle,
  Check,
  User,
  Building,
  MapPin,
  Mail,
  Calendar,
  FileText,
  Shield,
  Zap,
  ArrowRight,
  Upload,
  Camera,
  X,
} from "lucide-react"
import { submitFareReport } from "@/lib/actions"
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
                <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
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
                <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
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
                <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
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
                  📊 Transparency First
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Form Section */}
      <section id="report-form" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page 1: Lead Capture */}
          {currentStep === 0 && (
            <div className="bg-white rounded-lg p-8 mb-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started with NYC FARE Reporter</h2>
                <p className="text-lg text-gray-600">Tell us a bit about yourself and what you'd like to do</p>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Why we ask:</strong> This helps us personalize your experience and ensure we can follow up
                    appropriately.
                  </p>
                </div>
              </div>

              {hasLeadErrors && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">Please correct the errors below.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleLeadCaptureSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      onBlur={(e) => validateLeadField("firstName", e.target.value)}
                      className={`${commonInputClasses} ${leadErrors.firstName ? errorInputClasses : "border-gray-300"}`}
                      placeholder="Your first name"
                      disabled={isPending}
                    />
                    {leadErrors.firstName && <p className={errorTextClasses}>{leadErrors.firstName}</p>}
                  </div>

                  <div>
                    <label className={labelClasses}>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      onBlur={(e) => validateLeadField("lastName", e.target.value)}
                      className={`${commonInputClasses} ${leadErrors.lastName ? errorInputClasses : "border-gray-300"}`}
                      placeholder="Your last name"
                      disabled={isPending}
                    />
                    {leadErrors.lastName && <p className={errorTextClasses}>{leadErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={(e) => validateLeadField("email", e.target.value)}
                    className={`${commonInputClasses} ${leadErrors.email ? errorInputClasses : "border-gray-300"}`}
                    placeholder="your.email@example.com"
                    disabled={isPending}
                  />
                  {leadErrors.email && <p className={errorTextClasses}>{leadErrors.email}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={commonInputClasses}
                    placeholder="(555) 123-4567"
                    disabled={isPending}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    We'll only use this if you select "Schedule Test" and prefer phone contact
                  </p>
                </div>

                <div>
                  <label className={labelClasses}>How did you find us? *</label>
                  <select
                    value={formData.referralSource}
                    onChange={(e) => handleInputChange("referralSource", e.target.value)}
                    className={`${commonInputClasses} ${!formData.referralSource && hasLeadErrors ? errorInputClasses : "border-gray-300"}`}
                    disabled={isPending}
                  >
                    <option value="">Select an option</option>
                    {referralSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                  {!formData.referralSource && hasLeadErrors && (
                    <p className={errorTextClasses}>How you found us is required</p>
                  )}
                  {formData.referralSource === "Other" && (
                    <input
                      type="text"
                      value={formData.referralSourceOther}
                      onChange={(e) => handleInputChange("referralSourceOther", e.target.value)}
                      className={`${commonInputClasses} mt-2`}
                      placeholder="Please specify"
                      disabled={isPending}
                    />
                  )}
                </div>

                <div>
                  <label className={labelClasses}>What would you like to do? *</label>
                  {leadErrors.selectedForm && <p className="mb-3 text-sm text-red-600">{leadErrors.selectedForm}</p>}
                  <div className="grid md:grid-cols-3 gap-4">
                    <label
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                        formData.selectedFormType === "report"
                          ? "border-orange-500 bg-orange-50 shadow-lg"
                          : leadErrors.selectedForm
                            ? "border-red-300 hover:border-red-400"
                            : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name="selectedFormType"
                        value="report"
                        checked={formData.selectedFormType === "report"}
                        onChange={(e) => {
                          handleInputChange("selectedFormType", e.target.value as "report")
                          if (leadErrors.selectedForm) {
                            clearLeadFieldError("selectedForm")
                          }
                        }}
                        className="sr-only"
                        disabled={isPending}
                      />
                      <div className="text-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                            formData.selectedFormType === "report" ? "bg-orange-500" : "bg-orange-100"
                          }`}
                        >
                          <FileText
                            className={`w-6 h-6 ${
                              formData.selectedFormType === "report" ? "text-white" : "text-orange-600"
                            }`}
                          />
                        </div>
                        <div className="font-semibold text-gray-900 mb-2">File a Report</div>
                        <div className="text-sm text-gray-600">Report a FARE Act violation</div>
                        <div className="mt-2 text-xs text-orange-600 font-medium">~5-10 minutes</div>
                      </div>
                    </label>

                    <label
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                        formData.selectedFormType === "schedule"
                          ? "border-orange-500 bg-orange-50 shadow-lg"
                          : leadErrors.selectedForm
                            ? "border-red-300 hover:border-red-400"
                            : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name="selectedFormType"
                        value="schedule"
                        checked={formData.selectedFormType === "schedule"}
                        onChange={(e) => {
                          handleInputChange("selectedFormType", e.target.value as "schedule")
                          if (leadErrors.selectedForm) {
                            clearLeadFieldError("selectedForm")
                          }
                        }}
                        className="sr-only"
                        disabled={isPending}
                      />
                      <div className="text-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                            formData.selectedFormType === "schedule" ? "bg-blue-500" : "bg-blue-100"
                          }`}
                        >
                          <Calendar
                            className={`w-6 h-6 ${
                              formData.selectedFormType === "schedule" ? "text-white" : "text-blue-600"
                            }`}
                          />
                        </div>
                        <div className="font-semibold text-gray-900 mb-2">Schedule Test</div>
                        <div className="text-sm text-gray-600">Get help testing the system</div>
                        <div className="mt-2 text-xs text-blue-600 font-medium">~2 minutes</div>
                      </div>
                    </label>

                    <label
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                        formData.selectedFormType === "waitlist"
                          ? "border-orange-500 bg-orange-50 shadow-lg"
                          : leadErrors.selectedForm
                            ? "border-red-300 hover:border-red-400"
                            : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name="selectedFormType"
                        value="waitlist"
                        checked={formData.selectedFormType === "waitlist"}
                        onChange={(e) => {
                          handleInputChange("selectedFormType", e.target.value as "waitlist")
                          if (leadErrors.selectedForm) {
                            clearLeadFieldError("selectedForm")
                          }
                        }}
                        className="sr-only"
                        disabled={isPending}
                      />
                      <div className="text-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                            formData.selectedFormType === "waitlist" ? "bg-purple-500" : "bg-purple-100"
                          }`}
                        >
                          <Mail
                            className={`w-6 h-6 ${
                              formData.selectedFormType === "waitlist" ? "text-white" : "text-purple-600"
                            }`}
                          />
                        </div>
                        <div className="font-semibold text-gray-900 mb-2">Join Waitlist</div>
                        <div className="text-sm text-gray-600">Get launch updates</div>
                        <div className="mt-2 text-xs text-purple-600 font-medium">~1 minute</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.mailingListConsent}
                      onChange={(e) => handleInputChange("mailingListConsent", e.target.checked)}
                      className="mt-1 mr-3"
                      required
                      disabled={isPending}
                    />
                    <span className="text-sm text-blue-800">
                      I agree to receive updates about NYC FARE Reporter and be added to The NYC Agent mailing list for
                      updates and announcements. *
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={
                    isPending ||
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    !formData.selectedFormType ||
                    !formData.mailingListConsent ||
                    hasLeadErrors
                  }
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {formData.selectedFormType === "waitlist" ? "Just Put Me On Waitlist" : "Take Me To Report"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Page 2: Combined Report Flow */}
          {currentStep === 1 && (
            <div id="report-flow-start" className="bg-white rounded-lg p-8 mb-8 shadow-lg">
              <form onSubmit={handleCombinedFormSubmit} className="space-y-8">
                {/* Section A: Tester Opt-In (if not already selected from lead capture) */}
                {formData.selectedFormType === "" && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Would you like to help us test NYC FARE Reporter with a real report? *
                    </h2>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="testerOptIn"
                          value="report"
                          checked={formData.selectedFormType === "report"}
                          onChange={() => handleInputChange("selectedFormType", "report")}
                          className="mr-3"
                        />
                        <span>Yes, I want to submit my report now</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="testerOptIn"
                          value="schedule"
                          checked={formData.selectedFormType === "schedule"}
                          onChange={() => handleInputChange("selectedFormType", "schedule")}
                          className="mr-3"
                        />
                        <span>Yes, email me to schedule my report submission</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="testerOptIn"
                          value="waitlist"
                          checked={formData.selectedFormType === "waitlist"}
                          onChange={() => handleInputChange("selectedFormType", "waitlist")}
                          className="mr-3"
                        />
                        <span>No, just add me to the waitlist for updates</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Section B: Live Report Form */}
                {formData.selectedFormType === "report" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Report Form</h2>

                    {/* Property & Listing Details */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Property & Listing Details *</h3>
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Information *</label>
                        <div className="flex space-x-4 mb-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="propertyInfoType"
                              value="streeteasy"
                              checked={formData.propertyInfoType === "streeteasy"}
                              onChange={() => handleInputChange("propertyInfoType", "streeteasy")}
                              className="mr-2"
                            />
                            StreetEasy URL
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="propertyInfoType"
                              value="manual"
                              checked={formData.propertyInfoType === "manual"}
                              onChange={() => handleInputChange("propertyInfoType", "manual")}
                              className="mr-2"
                            />
                            Manual Address Entry
                          </label>
                        </div>

                        {formData.propertyInfoType === "streeteasy" && (
                          <div>
                            <label className={labelClasses}>StreetEasy URL *</label>
                            <input
                              type="url"
                              value={formData.streetEasyLink}
                              onChange={(e) => handleInputChange("streetEasyLink", e.target.value)}
                              className={commonInputClasses}
                              placeholder="https://streeteasy.com/..."
                            />
                          </div>
                        )}

                        {formData.propertyInfoType === "manual" && (
                          <div className="space-y-4">
                            <div>
                              <label className={labelClasses}>Manual Address *</label>
                              <input
                                type="text"
                                value={formData.manualAddress}
                                onChange={(e) => handleInputChange("manualAddress", e.target.value)}
                                className={commonInputClasses}
                                placeholder="123 Main St, New York, NY"
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className={labelClasses}>Borough</label>
                                <input
                                  type="text"
                                  value={formData.borough}
                                  onChange={(e) => handleInputChange("borough", e.target.value)}
                                  className={commonInputClasses}
                                  placeholder="Manhattan"
                                />
                              </div>
                              <div>
                                <label className={labelClasses}>Neighborhood</label>
                                <input
                                  type="text"
                                  value={formData.neighborhood}
                                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                                  className={commonInputClasses}
                                  placeholder="Lower East Side"
                                />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className={labelClasses}>Price</label>
                                <input
                                  type="text"
                                  value={formData.manualPrice}
                                  onChange={(e) => handleInputChange("manualPrice", e.target.value)}
                                  className={commonInputClasses}
                                  placeholder="$2500"
                                />
                              </div>
                              <div>
                                <label className={labelClasses}>Unit</label>
                                <input
                                  type="text"
                                  value={formData.manualUnit}
                                  onChange={(e) => handleInputChange("manualUnit", e.target.value)}
                                  className={commonInputClasses}
                                  placeholder="APT 4B"
                                />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className={labelClasses}>Bedrooms</label>
                                <input
                                  type="number"
                                  value={formData.manualBedrooms}
                                  onChange={(e) => handleInputChange("manualBedrooms", e.target.value)}
                                  className={commonInputClasses}
                                  placeholder="1"
                                />
                              </div>
                              <div>
                                <label className={labelClasses}>Bathrooms</label>
                                <input
                                  type="number"
                                  value={formData.manualBathrooms}
                                  onChange={(e) => handleInputChange("manualBathrooms", e.target.value)}
                                  className={commonInputClasses}
                                  placeholder="1"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Details *</h3>
                      <div className="space-y-4">
                        <label className={labelClasses}>Who are you reporting? *</label>
                        <div className="flex space-x-4 mb-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="whoReporting"
                              value="management"
                              checked={formData.whoReporting === "management"}
                              onChange={() => handleInputChange("whoReporting", "management")}
                              className="mr-2"
                            />
                            Management Company
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="whoReporting"
                              value="agent"
                              checked={formData.whoReporting === "agent"}
                              onChange={() => handleInputChange("whoReporting", "agent")}
                              className="mr-2"
                            />
                            Agent
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="whoReporting"
                              value="brokerage"
                              checked={formData.whoReporting === "brokerage"}
                              onChange={() => handleInputChange("whoReporting", "brokerage")}
                              className="mr-2"
                            />
                            Brokerage
                          </label>
                        </div>

                        {formData.whoReporting === "management" && (
                          <div>
                            <label className={labelClasses}>Management Company Name *</label>
                            <input
                              type="text"
                              value={formData.managementCompanyName}
                              onChange={(e) => handleInputChange("managementCompanyName", e.target.value)}
                              className={commonInputClasses}
                              placeholder="e.g., ABC Management"
                            />
                          </div>
                        )}

                        {formData.whoReporting === "agent" && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className={labelClasses}>Agent First Name *</label>
                              <input
                                type="text"
                                value={formData.agentFirstName}
                                onChange={(e) => handleInputChange("agentFirstName", e.target.value)}
                                className={commonInputClasses}
                                placeholder="e.g., John"
                              />
                            </div>
                            <div>
                              <label className={labelClasses}>Agent Last Name *</label>
                              <input
                                type="text"
                                value={formData.agentLastName}
                                onChange={(e) => handleInputChange("agentLastName", e.target.value)}
                                className={commonInputClasses}
                                placeholder="e.g., Doe"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className={labelClasses}>What brokerage do they work for? *</label>
                              <input
                                type="text"
                                value={formData.brokerageForAgent}
                                onChange={(e) => handleInputChange("brokerageForAgent", e.target.value)}
                                className={commonInputClasses}
                                placeholder="e.g., XYZ Realty"
                              />
                            </div>
                          </div>
                        )}

                        {formData.whoReporting === "brokerage" && (
                          <div>
                            <label className={labelClasses}>Brokerage Name *</label>
                            <input
                              type="text"
                              value={formData.brokerageName}
                              onChange={(e) => handleInputChange("brokerageName", e.target.value)}
                              className={commonInputClasses}
                              placeholder="e.g., XYZ Realty"
                            />
                          </div>
                        )}

                        <div>
                          <label className={labelClasses}>Business Address (Optional)</label>
                          <input
                            type="text"
                            value={formData.businessAddress}
                            onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                            className={commonInputClasses}
                            placeholder="123 Business Rd, New York, NY"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Phone (Optional)</label>
                          <input
                            type="tel"
                            value={formData.businessPhone}
                            onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                            className={commonInputClasses}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Email (Optional)</label>
                          <input
                            type="email"
                            value={formData.businessEmail}
                            onChange={(e) => handleInputChange("businessEmail", e.target.value)}
                            className={commonInputClasses}
                            placeholder="business@example.com"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Website (Optional)</label>
                          <input
                            type="url"
                            value={formData.businessWebsite}
                            onChange={(e) => handleInputChange("businessWebsite", e.target.value)}
                            className={commonInputClasses}
                            placeholder="https://www.business.com"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>License # (Optional)</label>
                          <input
                            type="text"
                            value={formData.businessLicense}
                            onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                            className={commonInputClasses}
                            placeholder="1234567"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact & Interaction */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact & Interaction</h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={labelClasses}>Have you contacted them?</span>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contactedBusiness"
                            checked={formData.contactedBusiness === true}
                            onChange={() => handleInputChange("contactedBusiness", true)}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contactedBusiness"
                            checked={formData.contactedBusiness === false}
                            onChange={() => handleInputChange("contactedBusiness", false)}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>

                      {formData.contactedBusiness && (
                        <div className="space-y-4">
                          <div>
                            <label className={labelClasses}>Employee Name & Contact (Optional)</label>
                            <textarea
                              value={formData.employeeName}
                              onChange={(e) => handleInputChange("employeeName", e.target.value)}
                              className={commonInputClasses}
                              rows={2}
                              placeholder="Name, phone, email of person you contacted"
                            />
                            <label className="flex items-center mt-2 text-sm text-blue-600 hover:underline cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.samePersonAsBusiness}
                                onChange={(e) => {
                                  handleInputChange("samePersonAsBusiness", e.target.checked)
                                  if (e.target.checked) {
                                    let employeeName = ""
                                    if (formData.whoReporting === "management") {
                                      employeeName = formData.managementCompanyName
                                    } else if (formData.whoReporting === "agent") {
                                      employeeName = `${formData.agentFirstName} ${formData.agentLastName}`.trim()
                                    } else if (formData.whoReporting === "brokerage") {
                                      employeeName = formData.brokerageName
                                    }
                                    handleInputChange("employeeName", employeeName)
                                  } else {
                                    handleInputChange("employeeName", "")
                                  }
                                }}
                                className="mr-2"
                              />
                              Was it the same person/agent/broker as listed above?
                            </label>
                          </div>
                          <div>
                            <label className={labelClasses}>What was the outcome? (Optional)</label>
                            <textarea
                              value={formData.whatHappened}
                              onChange={(e) => handleInputChange("whatHappened", e.target.value)}
                              className={commonInputClasses}
                              rows={3}
                              placeholder="Describe what happened during your interaction"
                            />
                          </div>
                          <div>
                            <label className={labelClasses}>Outcome Chips (Optional)</label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                "Refund offered",
                                "Ignored legal objections",
                                "Listing pulled",
                                "Leased elsewhere",
                                "Other",
                              ].map((chip) => (
                                <button
                                  key={chip}
                                  type="button"
                                  onClick={() => handleOutcomeChipToggle(chip)}
                                  className={`px-4 py-2 rounded-full text-sm ${
                                    formData.outcomeChips.includes(chip)
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  {chip}
                                </button>
                              ))}
                            </div>
                            {formData.outcomeChips.includes("Other") && (
                              <input
                                type="text"
                                value={formData.outcomeOtherText}
                                onChange={(e) => handleInputChange("outcomeOtherText", e.target.value)}
                                className={`${commonInputClasses} mt-2`}
                                placeholder="Please specify other outcome"
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Violation Categories */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Which of these happened? *</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Select at least one violation (you can select multiple). For more information about your rights,
                        check out the FARE Act:{" "}
                        <a
                          href="https://council.nyc.gov/chi-osse/the-fare-act/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:underline"
                        >
                          https://council.nyc.gov/chi-osse/the-fare-act/
                        </a>{" "}
                        and NYC Fair Housing laws:{" "}
                        <a
                          href="https://www.nyc.gov/site/fairhousing/index.page"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:underline"
                        >
                          https://www.nyc.gov/site/fairhousing/index.page
                        </a>
                      </p>
                      {Object.entries(violationCategories).map(([category, violations]) => (
                        <div key={category} className="mb-6">
                          <h4 className="text-lg font-medium text-gray-700 mb-3 capitalize">
                            {category.replace(/-/g, " ")} Violations:
                          </h4>
                          {category === "fee" && (
                            <p className="text-sm text-gray-500 mb-2">
                              Note: Application fees can vary for co-ops and condos. The "$20 cap" for application fees
                              does not apply to co-op or condo application fees.
                            </p>
                          )}
                          <div className="grid md:grid-cols-2 gap-3">
                            {violations.map((violation) => (
                              <label key={violation} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.violations.includes(violation)}
                                  onChange={() => handleViolationToggle(violation)}
                                  className="mr-2"
                                />
                                <span>{violation}</span>
                              </label>
                            ))}
                          </div>
                          {/* Enhanced Other field handling for each category */}
                          {formData.violations.includes("Other") && (
                            <div className="mt-3">
                              <textarea
                                value={formData.violationOtherTexts[`${category}-Other`] || ""}
                                onChange={(e) => handleOtherViolationText(`${category}-Other`, e.target.value)}
                                className={`${commonInputClasses} mt-2`}
                                rows={3}
                                placeholder={`Please specify other ${category.replace(/-/g, " ")} violation`}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* DCWP Fee Details (Enhanced with checkbox functionality) */}
                    {formData.violations.some((v) => violationCategories.fee.includes(v)) && (
                      <div className="border-t pt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">DCWP Fee Details</h3>
                        <div className="space-y-6">
                          {/* Fee Charges Checkbox Section */}
                          <div>
                            <label className={labelClasses}>
                              What fee charges were involved? (Select all that apply)
                            </label>
                            <div className="grid md:grid-cols-2 gap-3 mb-4">
                              {feeChargeOptions.map((charge) => (
                                <label key={charge} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={formData.feeCharges.includes(charge)}
                                    onChange={() => handleFeeChargeToggle(charge)}
                                    className="mr-2"
                                  />
                                  <span>{charge}</span>
                                </label>
                              ))}
                            </div>
                            {formData.feeCharges.includes("Other") && (
                              <input
                                type="text"
                                value={formData.feeChargesOther}
                                onChange={(e) => handleInputChange("feeChargesOther", e.target.value)}
                                className={`${commonInputClasses} mt-2`}
                                placeholder="Please specify other fee charges"
                              />
                            )}
                          </div>

                          <div>
                            <label className={labelClasses}>Illegal Broker/Agent Fee Charged?</label>
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="illegalBrokerFeeCharged"
                                  checked={formData.illegalBrokerFeeCharged === true}
                                  onChange={() => handleInputChange("illegalBrokerFeeCharged", true)}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="illegalBrokerFeeCharged"
                                  checked={formData.illegalBrokerFeeCharged === false}
                                  onChange={() => handleInputChange("illegalBrokerFeeCharged", false)}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Requirement to Use a Broker/Agent?</label>
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="requirementToUseBroker"
                                  checked={formData.requirementToUseBroker === true}
                                  onChange={() => handleInputChange("requirementToUseBroker", true)}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="requirementToUseBroker"
                                  checked={formData.requirementToUseBroker === false}
                                  onChange={() => handleInputChange("requirementToUseBroker", false)}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Fees or Charges Not Disclosed?</label>
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="feesNotDisclosed"
                                  checked={formData.feesNotDisclosed === true}
                                  onChange={() => handleInputChange("feesNotDisclosed", true)}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="feesNotDisclosed"
                                  checked={formData.feesNotDisclosed === false}
                                  onChange={() => handleInputChange("feesNotDisclosed", false)}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                            {formData.feesNotDisclosed && (
                              <input
                                type="text"
                                value={formData.feesNotDisclosedText}
                                onChange={(e) => handleInputChange("feesNotDisclosedText", e.target.value)}
                                className={`${commonInputClasses} mt-2`}
                                placeholder="What fees?"
                              />
                            )}
                          </div>
                          <div>
                            <label className={labelClasses}>Improper Fees in Advertisement or Listing?</label>
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="improperFeesInAd"
                                  checked={formData.improperFeesInAd === true}
                                  onChange={() => handleInputChange("improperFeesInAd", true)}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="improperFeesInAd"
                                  checked={formData.improperFeesInAd === false}
                                  onChange={() => handleInputChange("improperFeesInAd", false)}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                            {formData.improperFeesInAd && (
                              <input
                                type="url"
                                value={formData.improperFeesInAdUrl}
                                onChange={(e) => handleInputChange("improperFeesInAdUrl", e.target.value)}
                                className={`${commonInputClasses} mt-2`}
                                placeholder="Listing location/URL"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Details & Documents */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Details & Documents</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClasses}>Document Upload (Optional)</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to browse</p>
                            <input type="file" multiple className="sr-only" onChange={handleFileChange} />
                            <button
                              type="button"
                              className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                            >
                              Browse Files
                            </button>
                            <button
                              type="button"
                              className="mt-3 ml-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Camera className="w-4 h-4 mr-2" /> Capture Photo
                            </button>
                            <p className="mt-2 text-xs text-gray-500">Max file size: 10MB</p>
                            {selectedFiles.length > 0 && (
                              <div className="mt-4 text-left">
                                <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                                <div className="space-y-2">
                                  {selectedFiles.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                    >
                                      <span className="text-sm text-gray-600">
                                        {file.name} ({Math.round(file.size / 1024)} KB)
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className={labelClasses}>AI Report Refinement (Optional)</label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="aiRefinementOption"
                                value="refine"
                                checked={formData.aiRefinementOption === "refine"}
                                onChange={(e) => handleInputChange("aiRefinementOption", e.target.value)}
                                className="mr-2"
                              />
                              <span>I would like AI to refine this report</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="aiRefinementOption"
                                value="refine-and-email"
                                checked={formData.aiRefinementOption === "refine-and-email"}
                                onChange={(e) => handleInputChange("aiRefinementOption", e.target.value)}
                                className="mr-2"
                              />
                              <span>I would like AI to refine this report and email me a draft before submission</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="aiRefinementOption"
                                value="none"
                                checked={formData.aiRefinementOption === "none"}
                                onChange={(e) => handleInputChange("aiRefinementOption", e.target.value)}
                                className="mr-2"
                              />
                              <span>I would not like AI to refine this report</span>
                            </label>
                          </div>
                          {(formData.aiRefinementOption === "refine" ||
                            formData.aiRefinementOption === "refine-and-email") && (
                            <div className="mt-4">
                              <label className={labelClasses}>Report Description (2,000 characters) *</label>
                              <textarea
                                value={formData.reportDescription}
                                onChange={(e) => handleInputChange("reportDescription", e.target.value)}
                                className={commonInputClasses}
                                rows={5}
                                maxLength={2000}
                                placeholder="Describe what happened in detail for AI enhancement."
                              />
                              <p className="text-sm text-gray-500 text-right">
                                {formData.reportDescription.length} / 2000
                              </p>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className={labelClasses}>Describe What Happened *</label>
                          <textarea
                            value={formData.narrative}
                            onChange={(e) => handleInputChange("narrative", e.target.value)}
                            className={commonInputClasses}
                            rows={5}
                            placeholder="Please describe the incident in detail."
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Additional Notes (Optional)</label>
                          <textarea
                            value={formData.additionalNotes}
                            onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                            className={commonInputClasses}
                            rows={3}
                            placeholder="Any other details you'd like to add?"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Desired Outcome *</label>
                          <div className="grid md:grid-cols-2 gap-3">
                            {desiredOutcomes.map((outcome) => (
                              <label key={outcome} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.desiredOutcome.includes(outcome)}
                                  onChange={(e) => handleDesiredOutcomeToggle(outcome)}
                                  className="mr-2"
                                />
                                <span>{outcome}</span>
                              </label>
                            ))}
                          </div>
                          {formData.desiredOutcome.includes("Other") && (
                            <input
                              type="text"
                              value={formData.desiredOutcomeOther}
                              onChange={(e) => handleInputChange("desiredOutcomeOther", e.target.value)}
                              className={`${commonInputClasses} mt-2`}
                              placeholder="Please specify other desired outcome"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Complainant Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Information *</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClasses}>First Name *</label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className={commonInputClasses}
                            placeholder="Your first name"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Last Name *</label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className={commonInputClasses}
                            placeholder="Your last name"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Email *</label>
                          <input
                            type="email"
                            value={formData.userEmail}
                            onChange={(e) => handleInputChange("userEmail", e.target.value)}
                            className={commonInputClasses}
                            placeholder="your.email@example.com"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Phone (Optional)</label>
                          <input
                            type="tel"
                            value={formData.userPhone}
                            onChange={(e) => handleInputChange("userPhone", e.target.value)}
                            className={commonInputClasses}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Preferred Contact Method *</label>
                          <select
                            value={formData.preferredContact}
                            onChange={(e) => handleInputChange("preferredContact", e.target.value as "email" | "phone")}
                            className={commonInputClasses}
                          >
                            <option value="">Select method</option>
                            {preferredContactMethods.map((method) => (
                              <option key={method} value={method}>
                                {method.charAt(0).toUpperCase() + method.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isVeteran}
                            onChange={(e) => handleInputChange("isVeteran", e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Veteran Status (Optional)</span>
                        </label>
                      </div>
                    </div>

                    {/* Review & Submit */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Review & Submit</h3>

                      <label className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={formData.resendReportToMe}
                          onChange={(e) => handleInputChange("resendReportToMe", e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          Please resend report to me before submitting (Optional)
                        </span>
                      </label>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={formData.dcwpConsent}
                            onChange={(e) => handleInputChange("dcwpConsent", e.target.checked)}
                            className="mt-1 mr-3"
                            required
                          />
                          <span className="text-sm text-blue-800">
                            DCWP Acknowledgement: "I understand that by submitting this complaint, I am providing
                            information to the NYC Department of Consumer and Worker Protection (DCWP) and that DCWP may
                            use this information to investigate the business, enforce the law, or for other purposes
                            authorized by law. I also understand that DCWP may share this information with other
                            government agencies." *
                          </span>
                        </label>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={formData.proxyConsent}
                            onChange={(e) => handleInputChange("proxyConsent", e.target.checked)}
                            className="mt-1 mr-3"
                            required
                          />
                          <span className="text-sm text-blue-800">
                            Proxy-Submit Verification: "I verify that, to the best of my knowledge, all information in
                            this report is true, and I authorize NYC FARE Reporter to submit it on my behalf. I
                            understand that NYC FARE Reporter is not legally liable for the content or outcomes of this
                            submission." *
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isPending || !isReportFormValid}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                      >
                        {isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Submitting Report...
                          </>
                        ) : (
                          <>
                            Submit Report
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Section C: Schedule Your Report Later */}
                {formData.selectedFormType === "schedule" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule Your Report Later</h2>
                    <p className="text-lg text-gray-600 mb-6">
                      We'll email you within 24 hours with simple next steps to submit your report.
                    </p>

                    <div>
                      <label className={labelClasses}>Email Address *</label>
                      <input
                        type="email"
                        value={formData.userEmail}
                        onChange={(e) => handleInputChange("userEmail", e.target.value)}
                        className={commonInputClasses}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Best Time to Reach You *</label>
                      <select
                        value={formData.bestTimeToReachYou}
                        onChange={(e) =>
                          handleInputChange("bestTimeToReachYou", e.target.value as "morning" | "afternoon" | "evening")
                        }
                        className={commonInputClasses}
                      >
                        <option value="">Select a time</option>
                        {contactTimes.map((time) => (
                          <option key={time} value={time}>
                            {time.charAt(0).toUpperCase() + time.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}>Brief Issue Snapshot (Optional)</label>
                      <textarea
                        value={formData.briefIssueSnapshot}
                        onChange={(e) => handleInputChange("briefIssueSnapshot", e.target.value)}
                        className={commonInputClasses}
                        rows={3}
                        placeholder="Briefly describe the issue you'd like to report."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending || !isScheduleFormValid}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                    >
                      {isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Scheduling...
                        </>
                      ) : (
                        <>
                          Schedule My Report
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Page 3: Thank You Message */}
          {currentStep === 2 && thankYouMessage && (
            <div id="confirmation" className="bg-white rounded-lg p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">Thank You!</h2>
              <div className="text-gray-600 space-y-2 mb-8">
                <p>{thankYouMessage}</p>
                <p className="text-sm mt-4">
                  You should receive a confirmation email shortly. If you have any questions, please contact us at{" "}
                  <a
                    href="mailto:farereporter@thenycagent.com"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    farereporter@thenycagent.com
                  </a>
                </p>
                <p className="text-lg font-medium text-gray-700 mt-6">
                  Every report helps build a stronger case for tenant rights in NYC. Thank you for being part of the
                  change.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-2xl font-bold text-[#1E3A8A] mb-6">Help Spread the Word</h3>
                <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                  If this tool helped you, help us reach more renters who need it. Every follow, share, or coffee makes
                  a real difference in getting these tools to the people who need them most.
                </p>
                <div className="mb-8">
                  <a
                    href="https://buymeacoffee.com/thenycagent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-2xl mr-3">☕</span>
                    Buy Me Coffee
                  </a>
                </div>
                <div className="flex justify-center space-x-4 text-lg">
                  <p>
                    Share on{" "}
                    <a
                      href="https://instagram.com/thenycagent_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                    >
                      Instagram: @thenycagent_
                    </a>
                  </p>
                  <p>
                    Follow on{" "}
                    <a
                      href="https://tiktok.com/@thenycagent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                      TikTok: @thenycagent
                    </a>
                  </p>
                  <p>
                    Connect on{" "}
                    <a
                      href="https://www.linkedin.com/in/thenycagent/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-semibold text-[#1E3A8A] hover:text-blue-700 transition-colors duration-300"
                    >
                      LinkedIn: thenycagent
                    </a>
                  </p>
                  <p>
                    Subscribe on{" "}
                    <a
                      href="https://www.youtube.com/@thenycagent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-semibold text-red-600 hover:text-red-700 transition-colors duration-300"
                    >
                      YouTube: @thenycagent
                    </a>
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8 mt-8">
                <p className="text-gray-600 text-sm mb-4">Building tools for the people, one report at a time.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setCurrentStep(0)
                      setFormData((prev) => ({
                        ...prev,
                        selectedFormType: "",
                        submitted: false,
                        propertyInfoType: "",
                        streetEasyLink: "",
                        manualAddress: "",
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
                      }))
                      setThankYouMessage(null)
                      clearLeadErrors()
                      setSelectedFiles([])
                      scrollToSection("report-form")
                    }}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Submit Another Report
                  </button>
                  <a
                    href="/"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Madison's Story Section */}
      <section id="madison-story" className="py-16 bg-[#FAFAF8] relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-orange-100 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-blue-100 rounded-lg opacity-30 blur-xl z-0 rotate-45"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-30 blur-xl z-0"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4">Madison's Story</h2>
            <p className="text-xl text-gray-600 italic">A Letter from Madison Sutton — The NYC Agent</p>
          </div>

          <div className="relative flex flex-col md:flex-row rounded-2xl mb-12 shadow-xl overflow-hidden h-[350px]">
            <div className="relative w-full md:w-1/2 h-full">
              <Image
                src="/madison-new-photo.jpeg"
                alt="Madison Sutton, founder of NYC FARE Reporter"
                className="w-full h-full object-cover rounded-l-2xl"
                width={600}
                height={350}
              />
            </div>

            <div className="w-full md:w-1/2 bg-[#1E3A8A] text-white p-6 md:p-8 flex flex-col justify-center items-center text-center rounded-r-2xl">
              <h3 className="text-2xl font-bold mb-3">From Real Estate Agent to Technical Perspective Generator</h3>
              <p className="text-lg opacity-90 max-w-2xl">AI Strategist building tools that serve everyday people</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              Hello, I'm Madison Sutton, known professionally as @TheNYCAgent, and I built NYC FARE Reporter because I
              know this city—and its rental market—inside and out. This isn't just a reporting form. It's a system for
              accountability, visibility, and public pressure. With clarity, compassion, and a shot of audacity, - MS
              (@TheNYCAgent)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2"></div>
            <div className="bg-[#FEF2F2] p-8 rounded-xl border border-[#FDD8B1] shadow-md">
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-[#1E3A8A] mb-6">My Real Estate Journey</h4>
                <div className="space-y-4 text-gray-700">
                  <p>
                    I began my career as a New York City real estate agent, guiding hundreds of renters into homes—99%
                    of the time no-fee apartments (that one remaining percent? Rent-stabilized miracles).
                  </p>
                  <p>
                    Across my social media platforms, I grew to{" "}
                    <strong className="text-gray-900">150K followers and 1.9M+ likes</strong>, turning every listing
                    into an open book—straightforward, real, and rent-sensitive—because renters deserve clarity.
                  </p>
                  <p>
                    My approach earned coverage in <strong className="text-gray-900">100+ press outlets</strong>{" "}
                    including Bloomberg, CNN, WSJ, Forbes, and Fox Business.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#F0F9FF] p-8 rounded-xl border border-[#BFDBFE] shadow-md">
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-[#1E3A8A] mb-6">My Tech Transition</h4>
                <div className="space-y-4 text-gray-700">
                  <p>
                    I've since <strong className="text-gray-900">left real estate</strong> to build public-interest
                    technology and focus on content creation that drives systemic change.
                  </p>
                  <p>
                    NYC FARE Reporter represents my transition from working within the system to building tools that
                    <strong className="text-gray-900"> fundamentally change how it operates</strong>.
                  </p>
                  <p>This is the first system I'm launching in my new journey as a tech builder.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support This Work Section */}
      <section id="support-this-work" className="py-16 bg-[#FAFAF8] relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-orange-100 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-blue-100 rounded-lg opacity-30 blur-xl z-0 rotate-45"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-30 blur-xl z-0"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-[#1E3A8A] mb-6">Support This Work</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Your encouragement means everything. Grab me a coffee if this resonates with you, and help spread the word
            about apps that actually serve people. Every follow, share, or repost on{" "}
            <a
              href="https://instagram.com/thenycagent_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              Instagram: @thenycagent_
            </a>
            ,{" "}
            <a
              href="https://tiktok.com/@thenycagent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              TikTok: @thenycagent
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/thenycagent/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-[#1E3A8A] hover:text-blue-700 transition-colors duration-300"
            >
              LinkedIn: thenycagent
            </a>{" "}
            and{" "}
            <a
              href="https://www.youtube.com/@thenycagent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-red-600 hover:text-red-700 transition-colors duration-300"
            >
              YouTube: @thenycagent
            </a>{" "}
            makes a real difference in getting these tools to the people who need them. This is what building for the
            people looks like – join the journey and help it grow.
          </p>

          <div className="mb-12">
            <a
              href="https://buymeacoffee.com/thenycagent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-2xl mr-3">☕</span>
              Buy Me Coffee
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-[#FAFAF8] relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-orange-100 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-blue-100 rounded-lg opacity-30 blur-xl z-0 rotate-45"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-30 blur-xl z-0"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about NYC FARE Reporter</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">What is the FARE Act?</h3>
              <p className="text-gray-700 leading-relaxed">
                The FARE Act (Fairness in Apartment Rental Expenses Act) is a New York City law that aims to protect
                renters from unfair and excessive fees associated with renting an apartment. It primarily focuses on
                regulating broker fees and ensuring transparency in rental transactions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Who can file a report?</h3>
              <p className="text-gray-700 leading-relaxed">
                Anyone who believes they have been subjected to a violation of the FARE Act in New York City can file a
                report. This includes prospective tenants, current tenants, and anyone involved in a rental transaction
                where illegal fees or practices have occurred.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Is my information kept private?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes, your personal information is kept private. We only collect necessary information to process your
                report and communicate with you. Your identity will not be disclosed to the reported party or made
                publicly available.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">What happens after I submit a report?</h3>
              <p className="text-gray-700 leading-relaxed">
                After you submit a report, it is reviewed by our team. We may use AI to refine the report for clarity
                and legal precision. The report is then submitted to the appropriate authorities, such as the NYC
                Department of Consumer and Worker Protection (DCWP) and the NYS Department of State. You will be CC'd on
                all communications.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">How does the AI-enhancement work?</h3>
              <p className="text-gray-700 leading-relaxed">
                Our AI-enhancement feature uses advanced natural language processing to rewrite your complaint with
                clarity and legal precision. This helps ensure that your report is effectively communicated to the
                authorities and increases the likelihood of a successful outcome.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                What if I have more questions or need assistance?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                If you have more questions or need assistance, please contact us at{" "}
                <a href="mailto:farereporter@thenycagent.com" className="text-orange-600 hover:underline">
                  farereporter@thenycagent.com
                </a>
                . We're here to help!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NYC FARE Reporter. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            NYC FARE Reporter is not a substitute for legal advice. Consult with an attorney for specific legal
            guidance.
          </p>
        </div>
      </footer>

      {/* Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-orange-500 text-white w-12 h-12 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300"
        >
          <ArrowRight className="w-6 h-6 mx-auto transform rotate-90" />
        </button>
      )}
    </div>
  )
}
