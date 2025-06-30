"use client"

import type React from "react"

import { useState, useEffect, useMemo, startTransition } from "react"
import { submitFareReport } from "@/lib/actions"
import { useActionState } from "react"
import { useLeadValidation } from "@/hooks/use-lead-validation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon, ExternalLinkIcon, GithubIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "lucide-react"
import { TikTokIcon } from "@/components/icons/TikTokIcon" // Assuming you have this icon component

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

export default function Home() {
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
      if (!formData.proxyConsent) errors.proxyConsent = "Proxy submission consent is required"
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

      formData.violations.forEach((v) => submitFormData.append(`violation_${v}`, "on"))
      Object.entries(formData.violationOtherTexts).forEach(([key, value]) =>
        submitFormData.append(`violationOther_${key}`, value),
      )

      submitFormData.append("narrative", formData.narrative)
      submitFormData.append("additionalContext", formData.additionalNotes)
      formData.desiredOutcome.forEach((o) => submitFormData.append("desiredOutcome", o))
      submitFormData.append("desiredOutcomeOther", formData.desiredOutcomeOther)
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
      formData.feeCharges.forEach((charge) => submitFormData.append("feeCharge", charge))
      if (formData.feeChargesOther.trim()) {
        submitFormData.append("feeChargesOther", formData.feeChargesOther)
      }

      submitFormData.append("aiRefinementOption", formData.aiRefinementOption)
      if (formData.aiRefinementOption !== "none") {
        submitFormData.append("reportDescription", formData.reportDescription)
      }

      selectedFiles.forEach((file) => {
        submitFormData.append("documents", file)
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
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <span className="sr-only">NYC FARE Reporter</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/report">
            Report a Violation
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/schedule">
            Schedule a Test
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/waitlist">
            Join Waitlist
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/integration-test">
            Integration Test
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/test-forms">
            Form Test Suite
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Empowering Tenants: Report FARE Act Violations
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl">
                    The NYC FARE Reporter helps you easily document and report violations of the NYC FARE Act, ensuring
                    fairness in real estate.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                    href="/report"
                  >
                    Report a Violation
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                    href="/schedule"
                  >
                    Schedule a Test
                  </Link>
                </div>
              </div>
              <img
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                height="400"
                src="/hero-image.png"
                width="500"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform simplifies the process of reporting FARE Act violations.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>1. Document</CardTitle>
                </CardHeader>
                <CardContent>Easily upload evidence, details, and your experience regarding the violation.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2. Submit</CardTitle>
                </CardHeader>
                <CardContent>
                  Our system compiles your information into a comprehensive report for submission.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>3. Track</CardTitle>
                </CardHeader>
                <CardContent>
                  Receive updates on your report's status and next steps with relevant authorities.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/enlarged">What is the FARE Act?</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The NYC FARE Act (Fair Access to Rental Equity Act) is a landmark legislation designed to protect
                tenants from predatory practices in the rental market. It aims to increase transparency and fairness in
                real estate transactions.
              </p>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href="https://www.nyc.gov/site/dca/about/fare-act.page"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <img
              alt="FARE Act"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src="/placeholder.svg?height=310&width=550"
              width="550"
            />
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-8">Support This Work</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="https://instagram.com/thenycagent_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <InstagramIcon className="h-6 w-6" />
                <span>Instagram: @thenycagent_</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://tiktok.com/@thenycagent"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <TikTokIcon className="h-6 w-6" />
                <span>TikTok: @thenycagent</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/thenycagent/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LinkedinIcon className="h-6 w-6" />
                <span>LinkedIn: thenycagent</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.youtube.com/@thenycagent"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <YoutubeIcon className="h-6 w-6" />
                <span>YouTube: @thenycagent</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://buymeacoffee.com/thenycagent"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <img src="/placeholder.svg?height=24&width=24" alt="Buy Me a Coffee" className="h-6 w-6" />
                <span>Buy Me a Coffee</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">&copy; 2024 NYC FARE Reporter. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 flex items-center gap-1"
            href="https://github.com/vercel/v0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="h-3 w-3" />
            GitHub
          </Link>
        </nav>
      </footer>
    </div>
  )
}
