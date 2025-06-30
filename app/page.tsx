import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TikTokIcon } from "@/components/icons/tiktok-icon" // Ensure this path is correct
;("use client")

import type React from "react"

import { useState, useEffect, useMemo, startTransition } from "react"
import { submitFareReport } from "@/lib/actions"
import { useActionState } from "react"
import { useLeadValidation } from "@/hooks/use-lead-validation"

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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-4 text-sm">
          <Link href="/" className="font-bold text-lg">
            Supabase Community Starter
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex flex-col gap-6 items-center text-center">
          <h1 className="text-4xl font-bold">Welcome to the Supabase Community Starter</h1>
          <p className="text-lg text-muted-foreground">
            A boilerplate for building community-driven applications with Next.js and Supabase.
          </p>
          <div className="flex gap-4">
            <Link href="/test-forms">
              <Button size="lg">Test Forms</Button>
            </Link>
            <Link href="https://github.com/supabase/supabase" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                GitHub
              </Button>
            </Link>
          </div>
        </main>

        <section className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Secure user authentication powered by Supabase Auth.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-left space-y-2">
                <li>Email and password login</li>
                <li>Social logins (Google, GitHub, etc.)</li>
                <li>Password reset functionality</li>
                <li>Row-Level Security (RLS) examples</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Database</CardTitle>
              <CardDescription>Scalable PostgreSQL database with real-time capabilities.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-left space-y-2">
                <li>Schema migrations</li>
                <li>Real-time subscriptions</li>
                <li>Edge functions for serverless logic</li>
                <li>Integrated with Next.js Server Actions</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Storage</CardTitle>
              <CardDescription>Store and serve files with ease.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-left space-y-2">
                <li>Image and file uploads</li>
                <li>Public and private buckets</li>
                <li>Integrated with RLS for secure access</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Community Features</CardTitle>
              <CardDescription>Tools to build engaging community experiences.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-left space-y-2">
                <li>User profiles</li>
                <li>Content moderation hooks</li>
                <li>Integrated analytics (placeholder)</li>
                <li>Social media integration (e.g., TikTokIcon)</li>
              </ul>
              <div className="mt-4 flex justify-center">
                <TikTokIcon className="h-8 w-8 text-foreground" />
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=supabase"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>{" "}
            and{" "}
            <a href="https://nextjs.org/" target="_blank" className="font-bold hover:underline" rel="noreferrer">
              Next.js
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
