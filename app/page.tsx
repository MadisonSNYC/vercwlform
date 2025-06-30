"use client"

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

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

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
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold mb-4">NYC FARE Reporter</h1>
          <p className="text-xl mb-8">Empowering tenants and buyers to report illegal real estate practices in NYC.</p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/report">File a Report</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Identify a Violation</CardTitle>
              </CardHeader>
              <CardContent>
                Learn about common illegal practices like undisclosed fees, bait-and-switch tactics, and more.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. Submit Your Report</CardTitle>
              </CardHeader>
              <CardContent>Use our guided form to quickly and accurately document your experience.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>3. We Take Action</CardTitle>
              </CardHeader>
              <CardContent>
                Your report is processed and sent to the relevant NYC authorities for investigation.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Why Report?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                Illegal real estate practices harm countless New Yorkers. By reporting, you contribute to a fairer, more
                transparent housing market for everyone. Your voice helps hold bad actors accountable.
              </p>
              <ul className="list-disc list-inside text-left text-lg space-y-2">
                <li>Protect yourself and others from scams.</li>
                <li>Help enforce NYC housing laws.</li>
                <li>Contribute to a community database of violations.</li>
                <li>Empower regulatory bodies with actionable data.</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="NYC Skyline"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Meet the Founder</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Image
              src="/madison-new-photo.jpeg"
              alt="Madison"
              width={200}
              height={200}
              className="rounded-full object-cover w-48 h-48 border-4 border-blue-600"
            />
            <div className="text-left max-w-2xl">
              <h3 className="text-2xl font-semibold mb-2">Madison</h3>
              <p className="text-lg mb-4">
                Madison is a passionate advocate for tenant rights and transparency in the NYC real estate market. With
                years of experience navigating the complexities of housing, she founded NYC FARE Reporter to provide a
                much-needed platform for New Yorkers to fight back against predatory practices.
              </p>
              <p className="text-lg">
                "My goal is to make the reporting process as simple and effective as possible, ensuring every New Yorker
                has the tools to protect themselves and contribute to a more just housing system."
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Connect with Us</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="https://instagram.com/thenycagent_" target="_blank" rel="noopener noreferrer">
                Instagram: @thenycagent_
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://tiktok.com/@thenycagent" target="_blank" rel="noopener noreferrer">
                TikTok: @thenycagent
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://www.linkedin.com/in/thenycagent/" target="_blank" rel="noopener noreferrer">
                LinkedIn: thenycagent
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://www.youtube.com/@thenycagent" target="_blank" rel="noopener noreferrer">
                YouTube: @thenycagent
              </Link>
            </Button>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="text-center">
          <h2 className="text-4xl font-bold mb-6">Support This Work</h2>
          <p className="text-lg mb-8">
            If you find this platform helpful and want to support our mission, consider buying us a coffee! Your
            contribution helps us maintain and improve this service for all New Yorkers.
          </p>
          <Button asChild size="lg" className="bg-yellow-500 text-white hover:bg-yellow-600">
            <Link href="https://buymeacoffee.com/thenycagent" target="_blank" rel="noopener noreferrer">
              Buy Me a Coffee
            </Link>
          </Button>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} NYC FARE Reporter. All rights reserved.</p>
          <nav className="mt-4">
            <ul className="flex justify-center space-x-6">
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}
