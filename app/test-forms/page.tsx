"use client"

import { useState } from "react"
import Link from "next/link"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { leadCaptureSchema, reportFormSchema } from "@/components/test-utils/form-validator"
import * as z from "zod"
import { FormType } from "@/lib/constants"

// Mock implementations for hooks to simulate behavior in preview
const useLeadFormMock = (initialData: any) => {
  const [leadData, setLeadData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    selectedForm: initialData.selectedForm || "",
    mailingListConsent: initialData.mailingListConsent || false,
  })

  const handleLeadInputChange = (field: string, value: any) => {
    setLeadData((prev) => ({ ...prev, [field]: value }))
  }

  const validateLeadAll = (data: any) => {
    try {
      leadCaptureSchema.parse(data)
      return {}
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message
          }
        })
        return newErrors
      }
      return { general: "An unexpected validation error occurred." }
    }
  }

  return { leadData, handleLeadInputChange, validateLeadAll }
}

const useReportFormMock = (initialLeadData: any) => {
  const [formData, setFormData] = useState({
    formType: initialLeadData.selectedForm || "",
    email: initialLeadData.email || "",
    contactTime: "",
    issueSnapshot: "",
    hasStreetEasyListing: true,
    streetEasyLink: "",
    manualAddress: "",
    borough: "",
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
    userEmail: initialLeadData.email || "",
    userPhone: initialLeadData.phone || "",
    preferredContact: "",
    isVeteran: false,
    dcwpConsent: false,
    proxyConsent: false,
    mailingListConsent: initialLeadData.mailingListConsent || false,
    submitted: false,
    referralSource: "",
    referralSourceOther: "",
    interests: [],
    homeAddress: "",
  })

  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleViolationToggle = (violation: string) => {
    setFormData((prev) => {
      const newViolations = prev.violations.includes(violation)
        ? prev.violations.filter((v) => v !== violation)
        : [...prev.violations, violation]
      return { ...prev, violations: newViolations }
    })
    if (errors.violations) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors.violations
        return newErrors
      })
    }
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

  const addLandlord = () => {
    setFormData((prev) => ({
      ...prev,
      landlordName: [...prev.landlordName, { name: "", company: "" }],
    }))
    if (errors.landlordName) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors.landlordName
        delete newErrors.brokerName
        delete newErrors.brokerageName
        return newErrors
      })
    }
  }

  const removeLandlord = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      landlordName: prev.landlordName.filter((_, i) => i !== index),
    }))
  }

  const updateLandlord = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newLandlords = [...prev.landlordName]
      newLandlords[index] = { ...newLandlords[index], [field]: value }
      return { ...prev, landlordName: newLandlords }
    })
    if (errors.landlordName) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors.landlordName
        delete newErrors.brokerName
        delete newErrors.brokerageName
        return newErrors
      })
    }
  }

  const addBroker = () => {
    setFormData((prev) => ({
      ...prev,
      brokerName: [...prev.brokerName, { name: "", company: "", phone: "", email: "" }],
    }))
    if (errors.brokerName) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors.landlordName
        delete newErrors.brokerName
        delete newErrors.brokerageName
        return newErrors
      })
    }
  }

  const removeBroker = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      brokerName: prev.brokerName.filter((_, i) => i !== index),
    }))
  }

  const updateBroker = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newBrokers = [...prev.brokerName]
      newBrokers[index] = { ...newBrokers[index], [field]: value }
      return { ...prev, brokerName: newBrokers }
    })
    if (errors.brokerName) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors.landlordName
        delete newErrors.brokerName
        delete newErrors.brokerageName
        return newErrors
      })
    }
  }

  const addBrokerage = () => {
    setFormData((prev) => ({
      ...prev,
      brokerageName: [...prev.brokerageName, { name: "", address: "", phone: "", email: "" }],
    }))
    if (errors.brokerageName) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors.landlordName
        delete newErrors.brokerName
        delete newErrors.brokerageName
        return newErrors
      })
    }
  }

  const removeBrokerage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      brokerageName: prev.brokerageName.filter((_, i) => i !== index),
    }))
  }

  const updateBrokerage = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newBrokerages = [...prev.brokerageName]
      newBrokerages[index] = { ...newBrokerages[index], [field]: value }
      return { ...prev, brokerageName: newBrokerages }
    })
    if (errors.brokerageName) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors.landlordName
        delete newErrors.brokerName
        delete newErrors.brokerageName
        return newErrors
      })
    }
  }

  const validateForm = () => {
    try {
      const dataToValidate = {
        ...formData,
        landlordName: formData.landlordName.map((l: any) => ({ name: l.name || "", company: l.company || "" })),
        brokerName: formData.brokerName.map((b: any) => ({
          name: b.name || "",
          company: b.company || "",
          phone: b.phone || "",
          email: b.email || "",
        })),
        brokerageName: formData.brokerageName.map((br: any) => ({
          name: br.name || "",
          address: br.address || "",
          phone: br.phone || "",
          email: br.email || "",
        })),
        violations: formData.violations || [],
        violationOtherTexts: formData.violationOtherTexts || {},
        hasStreetEasyListing: !!formData.hasStreetEasyListing,
        contactedBusiness: !!formData.contactedBusiness,
        isVeteran: !!formData.isVeteran,
        dcwpConsent: !!formData.dcwpConsent,
        proxyConsent: !!formData.proxyConsent,
        mailingListConsent: !!formData.mailingListConsent,
      }
      reportFormSchema.parse(dataToValidate)
      setErrors({})
      return {}
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message
          }
        })

        const hasLandlord = formData.landlordName.some((l: any) => l.name.trim() || l.company.trim())
        const hasBroker = formData.brokerName.some(
          (b: any) => b.name.trim() || b.company.trim() || b.phone.trim() || b.email.trim(),
        )
        const hasBrokerage = formData.brokerageName.some(
          (br: any) => br.name.trim() || br.address.trim() || br.phone.trim() || br.email.trim(),
        )

        if (formData.formType === FormType.Report && !hasLandlord && !hasBroker && !hasBrokerage) {
          const errorMessage = "At least one of the following is required: Landlord, Broker, or Brokerage information."
          newErrors.landlordName = errorMessage
          newErrors.brokerName = errorMessage
          newErrors.brokerageName = errorMessage
        } else {
          if (newErrors.landlordName && (hasLandlord || hasBroker || hasBrokerage)) {
            delete newErrors.landlordName
            delete newErrors.brokerName
            delete newErrors.brokerageName
          }
        }

        setErrors(newErrors)
        return newErrors
      }
      setErrors({ general: "An unexpected validation error occurred." })
      return { general: "An unexpected validation error occurred." }
    }
  }

  return {
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
    errors,
    validateForm,
  }
}

// Mock components for testing purposes
const LeadCaptureFormMock = ({ onLeadCaptured, initialData }: any) => {
  const { leadData, handleLeadInputChange, validateLeadAll } = useLeadFormMock(initialData)
  const [leadErrors, setLeadErrors] = useState<Record<string, string | undefined>>({})
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLeadSubmitting(true)
    setLeadErrors({})

    const validationErrors = validateLeadAll(leadData)
    if (Object.keys(validationErrors).length > 0) {
      setLeadErrors(validationErrors)
      setLeadSubmitting(false)
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the lead form.",
        variant: "destructive",
      })
      return
    }

    // Simulate server action
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const success = Math.random() > 0.1 // 90% success rate
    if (success) {
      toast({
        title: "Success!",
        description: "Lead captured successfully. Proceeding to next step.",
      })
      onLeadCaptured(leadData)
    } else {
      setLeadErrors({ general: "Mock submission failed. Please try again." })
      toast({
        title: "Submission Failed",
        description: "There was an issue capturing your lead. Please try again.",
        variant: "destructive",
      })
    }
    setLeadSubmitting(false)
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Lead Capture Form (Test)</CardTitle>
      </CardHeader>
      <CardContent>
        {leadErrors.general && <div className="mb-4 text-red-500 text-sm">{leadErrors.general}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={leadData.firstName}
              onChange={(e) => handleLeadInputChange("firstName", e.target.value)}
            />
            {leadErrors.firstName && <p className="text-red-500 text-sm">{leadErrors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={leadData.lastName}
              onChange={(e) => handleLeadInputChange("lastName", e.target.value)}
            />
            {leadErrors.lastName && <p className="text-red-500 text-sm">{leadErrors.lastName}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={leadData.email}
              onChange={(e) => handleLeadInputChange("email", e.target.value)}
            />
            {leadErrors.email && <p className="text-red-500 text-sm">{leadErrors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={leadData.phone}
              onChange={(e) => handleLeadInputChange("phone", e.target.value)}
            />
            {leadErrors.phone && <p className="text-red-500 text-sm">{leadErrors.phone}</p>}
          </div>
          <div>
            <Label>Selected Form</Label>
            <Select
              value={leadData.selectedForm}
              onValueChange={(value) => handleLeadInputChange("selectedForm", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select form type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FormType.Report}>Report</SelectItem>
                <SelectItem value={FormType.Schedule}>Schedule</SelectItem>
                <SelectItem value={FormType.Waitlist}>Waitlist</SelectItem>
              </SelectContent>
            </Select>
            {leadErrors.selectedForm && <p className="text-red-500 text-sm">{leadErrors.selectedForm}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mailingListConsent"
              checked={leadData.mailingListConsent}
              onCheckedChange={(checked) => handleLeadInputChange("mailingListConsent", checked)}
            />
            <Label htmlFor="mailingListConsent">Mailing List Consent</Label>
          </div>
          {leadErrors.mailingListConsent && <p className="text-red-500 text-sm">{leadErrors.mailingListConsent}</p>}
          <Button type="submit" disabled={leadSubmitting}>
            {leadSubmitting ? "Submitting..." : "Submit Lead"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

const ReportFormMock = ({ initialLeadData, submitAction, isPending, submitState }: any) => {
  const {
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
    errors,
    validateForm,
  } = useReportFormMock(initialLeadData)
  const { toast } = useToast()

  const violationCategories = {
    listing: [
      "Bait-and-Switch Listing",
      "Misleading Photos/Amenities",
      '"No-Fee" Ad That Added a Fee',
      "Undisclosed Mandatory Fees",
      'Discriminatory Practice (e.g. "No Section 8," voucher steering)',
      "Other - Listing",
    ],
    fee: [
      "Illegal Broker/Agent Fee",
      "Forced Broker Use (Dual-Agency/Tenant-Rep Sig)",
      "Excessive App/Processing Fee (over $20)",
      "Illicit Security Deposit (over 1× rent)",
      "Cash-Only or Personal Payment Request",
      "Other - Fee",
    ],
    behavior: [
      "High-Pressure Sales Tactics",
      "Retaliation When Questioned",
      "Misrepresentation of Law or Exemptions",
      "Other - Behavior",
    ],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      console.error("Form validation failed:", validationErrors)
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the report form.",
        variant: "destructive",
      })
      return
    }

    // Simulate FormData creation for server action
    const mockFormData = new FormData()
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const value = (formData as any)[key]
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object" && item !== null) {
              for (const subKey in item) {
                mockFormData.append(`${key}[${index}].${subKey}`, (item as any)[subKey])
              }
            } else {
              mockFormData.append(key, item)
            }
          })
        } else if (typeof value === "boolean") {
          mockFormData.append(key, value ? "on" : "off")
        } else if (typeof value === "object" && value !== null) {
          for (const subKey in value) {
            mockFormData.append(`${key}_${subKey}`, (value as any)[subKey])
          }
        } else {
          mockFormData.append(key, value)
        }
      }
    }

    // Simulate server action call
    const result = await submitAction(mockFormData)
    if (result?.success) {
      toast({
        title: "Success!",
        description: result.message || "Report submitted successfully.",
      })
    } else {
      toast({
        title: "Submission Failed",
        description: result?.error || "There was an issue submitting your report. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Form (Test)</CardTitle>
      </CardHeader>
      <CardContent>
        {submitState?.error && <div className="mb-4 text-red-500 text-sm">{submitState.error}</div>}
        {errors.general && <div className="mb-4 text-red-500 text-sm">{errors.general}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="formType" value={formData.formType} />
          <input type="hidden" name="firstName" value={formData.firstName} />
          <input type="hidden" name="lastName" value={formData.lastName} />
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="phone" value={formData.userPhone} />
          <input type="hidden" name="mailingListConsent" value={formData.mailingListConsent ? "on" : "off"} />

          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userEmail">Email Address</Label>
              <Input
                id="userEmail"
                name="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange("userEmail", e.target.value)}
                readOnly
              />
              {errors.userEmail && <p className="text-red-500 text-sm">{errors.userEmail}</p>}
            </div>
            <div>
              <Label htmlFor="userPhone">Phone Number (Optional)</Label>
              <Input
                id="userPhone"
                name="userPhone"
                type="tel"
                value={formData.userPhone}
                onChange={(e) => handleInputChange("userPhone", e.target.value)}
              />
              {errors.userPhone && <p className="text-red-500 text-sm">{errors.userPhone}</p>}
            </div>
          </div>

          {formData.formType === FormType.Report && (
            <>
              <h3 className="text-lg font-semibold mt-6">Property Information</h3>
              <div>
                <Label htmlFor="hasStreetEasyListing">Is there a StreetEasy listing?</Label>
                <RadioGroup
                  id="hasStreetEasyListing"
                  name="hasStreetEasyListing"
                  value={formData.hasStreetEasyListing ? "yes" : "no"}
                  onValueChange={(value) => handleInputChange("hasStreetEasyListing", value === "yes")}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="se-yes" />
                    <Label htmlFor="se-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="se-no" />
                    <Label htmlFor="se-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.hasStreetEasyListing ? (
                <div>
                  <Label htmlFor="streetEasyLink">StreetEasy Listing Link *</Label>
                  <Input
                    id="streetEasyLink"
                    name="streetEasyLink"
                    type="url"
                    value={formData.streetEasyLink}
                    onChange={(e) => handleInputChange("streetEasyLink", e.target.value)}
                  />
                  {errors.streetEasyLink && <p className="text-red-500 text-sm">{errors.streetEasyLink}</p>}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manualAddress">Property Address *</Label>
                    <Input
                      id="manualAddress"
                      name="manualAddress"
                      type="text"
                      value={formData.manualAddress}
                      onChange={(e) => handleInputChange("manualAddress", e.target.value)}
                    />
                    {errors.manualAddress && <p className="text-red-500 text-sm">{errors.manualAddress}</p>}
                  </div>
                  <div>
                    <Label htmlFor="borough">Borough *</Label>
                    <Select
                      name="borough"
                      value={formData.borough}
                      onValueChange={(value) => handleInputChange("borough", value)}
                    >
                      <SelectTrigger id="borough">
                        <SelectValue placeholder="Select Borough" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manhattan">Manhattan</SelectItem>
                        <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                        <SelectItem value="Queens">Queens</SelectItem>
                        <SelectItem value="Bronx">Bronx</SelectItem>
                        <SelectItem value="Staten Island">Staten Island</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.borough && <p className="text-red-500 text-sm">{errors.borough}</p>}
                  </div>
                  {/* Add other manual property fields as needed */}
                </div>
              )}

              <h3 className="text-lg font-semibold mt-6">Responsible Parties</h3>
              {(errors.landlordName || errors.brokerName || errors.brokerageName) && (
                <p className="text-red-500 text-sm">
                  {errors.landlordName || errors.brokerName || errors.brokerageName}
                </p>
              )}
              {formData.landlordName.map((landlord: any, index: number) => (
                <div key={index} className="border p-3 rounded-md mb-2">
                  <Label>Landlord {index + 1}</Label>
                  <Input
                    placeholder="Name"
                    value={landlord.name}
                    onChange={(e) => updateLandlord(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Company"
                    value={landlord.company}
                    onChange={(e) => updateLandlord(index, "company", e.target.value)}
                  />
                  <Button type="button" onClick={() => removeLandlord(index)} variant="destructive" size="sm">
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addLandlord} variant="outline">
                Add Landlord
              </Button>

              {/* Brokers */}
              {formData.brokerName.map((broker: any, index: number) => (
                <div key={index} className="border p-3 rounded-md mb-2">
                  <Label>Broker {index + 1}</Label>
                  <Input
                    placeholder="Name"
                    value={broker.name}
                    onChange={(e) => updateBroker(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Company"
                    value={broker.company}
                    onChange={(e) => updateBroker(index, "company", e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={broker.phone}
                    onChange={(e) => updateBroker(index, "phone", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    value={broker.email}
                    onChange={(e) => updateBroker(index, "email", e.target.value)}
                  />
                  <Button type="button" onClick={() => removeBroker(index)} variant="destructive" size="sm">
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addBroker} variant="outline">
                Add Broker
              </Button>

              {/* Brokerages */}
              {formData.brokerageName.map((brokerage: any, index: number) => (
                <div key={index} className="border p-3 rounded-md mb-2">
                  <Label>Brokerage {index + 1}</Label>
                  <Input
                    placeholder="Name"
                    value={brokerage.name}
                    onChange={(e) => updateBrokerage(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Address"
                    value={brokerage.address}
                    onChange={(e) => updateBrokerage(index, "address", e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={brokerage.phone}
                    onChange={(e) => updateBrokerage(index, "phone", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    value={brokerage.email}
                    onChange={(e) => updateBrokerage(index, "email", e.target.value)}
                  />
                  <Button type="button" onClick={() => removeBrokerage(index)} variant="destructive" size="sm">
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addBrokerage} variant="outline">
                Add Brokerage
              </Button>

              <h3 className="text-lg font-semibold mt-6">Violation Details</h3>
              {errors.violations && <p className="text-red-500 text-sm">{errors.violations}</p>}
              {Object.entries(violationCategories).map(([category, violations]) => (
                <div key={category} className="mb-4">
                  <h4 className="font-medium capitalize">{category} Violations</h4>
                  {violations.map((violation) => (
                    <div key={violation} className="flex items-center space-x-2">
                      <Checkbox
                        id={`violation_${violation.replace(/[^a-zA-Z0-9]/g, "")}`}
                        checked={formData.violations.includes(violation)}
                        onCheckedChange={() => handleViolationToggle(violation)}
                      />
                      <Label htmlFor={`violation_${violation.replace(/[^a-zA-Z0-9]/g, "")}`}>{violation}</Label>
                    </div>
                  ))}
                  {formData.violations.includes(`Other - ${category.charAt(0).toUpperCase() + category.slice(1)}`) && (
                    <div className="mt-2">
                      <Input
                        placeholder={`Specify other ${category} violation`}
                        value={formData.violationOtherTexts[category] || ""}
                        onChange={(e) => handleOtherViolationText(category, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div>
                <Label htmlFor="narrative">Narrative *</Label>
                <Textarea
                  id="narrative"
                  name="narrative"
                  value={formData.narrative}
                  onChange={(e) => handleInputChange("narrative", e.target.value)}
                />
                {errors.narrative && <p className="text-red-500 text-sm">{errors.narrative}</p>}
              </div>
              <div>
                <Label htmlFor="desiredOutcome">Desired Outcome *</Label>
                <Select
                  name="desiredOutcome"
                  value={formData.desiredOutcome}
                  onValueChange={(value) => handleInputChange("desiredOutcome", value)}
                >
                  <SelectTrigger id="desiredOutcome">
                    <SelectValue placeholder="Select an outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Refund of illegal fees">Refund of illegal fees</SelectItem>
                    <SelectItem value="Investigation of broker/landlord">Investigation of broker/landlord</SelectItem>
                    <SelectItem value="Public record of violation">Public record of violation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.desiredOutcome && <p className="text-red-500 text-sm">{errors.desiredOutcome}</p>}
              </div>
              {formData.desiredOutcome === "Other" && (
                <div>
                  <Label htmlFor="desiredOutcomeOther">Specify Other Desired Outcome</Label>
                  <Input
                    id="desiredOutcomeOther"
                    name="desiredOutcomeOther"
                    type="text"
                    value={formData.desiredOutcomeOther}
                    onChange={(e) => handleInputChange("desiredOutcomeOther", e.target.value)}
                  />
                  {errors.desiredOutcomeOther && <p className="text-red-500 text-sm">{errors.desiredOutcomeOther}</p>}
                </div>
              )}
              <div>
                <Label htmlFor="referralSource">How did you hear about us? *</Label>
                <Select
                  name="referralSource"
                  value={formData.referralSource}
                  onValueChange={(value) => handleInputChange("referralSource", value)}
                >
                  <SelectTrigger id="referralSource">
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Social Media (TikTok/Instagram)">Social Media (TikTok/Instagram)</SelectItem>
                    <SelectItem value="Friend/Family">Friend/Family</SelectItem>
                    <SelectItem value="News/Press">News/Press</SelectItem>
                    <SelectItem value="Community Organization">Community Organization</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.referralSource && <p className="text-red-500 text-sm">{errors.referralSource}</p>}
              </div>
              {formData.referralSource === "Other" && (
                <div>
                  <Label htmlFor="referralSourceOther">Specify Other Referral Source</Label>
                  <Input
                    id="referralSourceOther"
                    name="referralSourceOther"
                    type="text"
                    value={formData.referralSourceOther}
                    onChange={(e) => handleInputChange("referralSourceOther", e.target.value)}
                  />
                  {errors.referralSourceOther && <p className="text-red-500 text-sm">{errors.referralSourceOther}</p>}
                </div>
              )}
              <div>
                <Label htmlFor="homeAddress">Your Home Address (Optional)</Label>
                <Input
                  id="homeAddress"
                  name="homeAddress"
                  type="text"
                  value={formData.homeAddress}
                  onChange={(e) => handleInputChange("homeAddress", e.target.value)}
                />
                {errors.homeAddress && <p className="text-red-500 text-sm">{errors.homeAddress}</p>}
              </div>
              <div>
                <Label htmlFor="preferredContact">Preferred Method of Contact</Label>
                <Select
                  name="preferredContact"
                  value={formData.preferredContact}
                  onValueChange={(value) => handleInputChange("preferredContact", value)}
                >
                  <SelectTrigger id="preferredContact">
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredContact && <p className="text-red-500 text-sm">{errors.preferredContact}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVeteran"
                  name="isVeteran"
                  checked={formData.isVeteran}
                  onCheckedChange={(checked) => handleInputChange("isVeteran", checked)}
                />
                <Label htmlFor="isVeteran">Are you a veteran?</Label>
              </div>

              <h3 className="text-lg font-semibold mt-6">Consents *</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dcwpConsent"
                    name="dcwpConsent"
                    checked={formData.dcwpConsent}
                    onCheckedChange={(checked) => handleInputChange("dcwpConsent", checked)}
                  />
                  <Label htmlFor="dcwpConsent">Authorize DCWP submission</Label>
                </div>
                {errors.dcwpConsent && <p className="text-red-500 text-sm">{errors.dcwpConsent}</p>}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="proxyConsent"
                    name="proxyConsent"
                    checked={formData.proxyConsent}
                    onCheckedChange={(checked) => handleInputChange("proxyConsent", checked)}
                  />
                  <Label htmlFor="proxyConsent">Authorize proxy communication</Label>
                </div>
                {errors.proxyConsent && <p className="text-red-500 text-sm">{errors.proxyConsent}</p>}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mailingListConsent"
                    name="mailingListConsent"
                    checked={formData.mailingListConsent}
                    onCheckedChange={(checked) => handleInputChange("mailingListConsent", checked)}
                  />
                  <Label htmlFor="mailingListConsent">Mailing list consent</Label>
                </div>
                {errors.mailingListConsent && <p className="text-red-500 text-sm">{errors.mailingListConsent}</p>}
              </div>
            </>
          )}

          {(formData.formType === FormType.Schedule || formData.formType === FormType.Waitlist) && (
            <>
              <h3 className="text-lg font-semibold mt-6">Additional Details</h3>
              <div>
                <Label htmlFor="contactTime">Preferred Contact Time (Optional)</Label>
                <Input
                  id="contactTime"
                  name="contactTime"
                  type="text"
                  value={formData.contactTime}
                  onChange={(e) => handleInputChange("contactTime", e.target.value)}
                />
                {errors.contactTime && <p className="mt-1 text-sm text-red-600">{errors.contactTime}</p>}
              </div>
              <div>
                <Label htmlFor="issueSnapshot">Brief Issue Snapshot (Optional)</Label>
                <Textarea
                  id="issueSnapshot"
                  name="issueSnapshot"
                  value={formData.issueSnapshot}
                  onChange={(e) => handleInputChange("issueSnapshot", e.target.value)}
                />
                {errors.issueSnapshot && <p className="mt-1 text-sm text-red-600">{errors.issueSnapshot}</p>}
              </div>
            </>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

const ThankYouSectionMock = ({ message, onReset }: { message: string; onReset: () => void }) => {
  return (
    <Card className="text-center p-8">
      <CardTitle className="text-2xl font-bold mb-4">Thank You!</CardTitle>
      <CardContent>
        <p className="text-lg text-gray-700 mb-6">{message}</p>
        <Button onClick={onReset}>Start New Report</Button>
      </CardContent>
    </Card>
  )
}

export default function TestFormsHome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-8 text-4xl font-bold">Test Forms Home</h1>
      <div className="flex space-x-4">
        <Link href="/test-forms/forms-preview">
          <div className="rounded-lg bg-blue-500 px-6 py-3 text-white shadow-md transition-colors hover:bg-blue-600">
            Go to Forms Preview
          </div>
        </Link>
      </div>
    </div>
  )
}
