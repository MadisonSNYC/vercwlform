"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { submitLead, submitReport } from "@/lib/actions"
import { useLeadValidation } from "@/hooks/use-lead-validation"
import { useRouter } from "next/navigation"

export default function TestFormsPage() {
  const [formType, setFormType] = useState("waitlist")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    contactTime: "",
    issueSnapshot: "",
    mailingListConsent: false,
    // Report specific fields
    preferredContact: "",
    isVeteran: false,
    hasStreeteasyListing: false,
    streeteasyLink: "",
    manualAddress: "",
    manualPrice: "",
    manualUnit: "",
    manualBedrooms: "",
    manualBathrooms: "",
    borough: "",
    neighborhood: "",
    landlordName: "",
    landlordCompany: "",
    brokerName: "",
    brokerCompany: "",
    brokerageName: "",
    businessAddress: "",
    contactedBusiness: false,
    employeeName: "",
    whatHappened: "",
    outcome: "",
    violations: [],
    violationOthers: [],
    illegalBrokerFeeCharged: false,
    requirementToUseBroker: false,
    feesNotDisclosed: false,
    feesNotDisclosedText: "",
    improperFeesInAd: false,
    improperFeesInAdUrl: "",
    feeCharges: [],
    feeChargesOther: "",
    narrative: "",
    additionalContext: "",
    desiredOutcomeArray: [],
    desiredOutcomeOther: "",
    aiRefinementOption: "",
    reportDescription: "",
    referralSource: "",
    referralSourceOther: "",
    dcwpConsent: false,
    proxyConsent: false,
    documentInfo: [],
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { validateLeadForm, validateReportForm } = useLeadValidation()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxGroupChange = (id: string, value: string, isChecked: boolean) => {
    setFormData((prev) => {
      const currentArray = Array.isArray(prev[id as keyof typeof prev])
        ? (prev[id as keyof typeof prev] as string[])
        : []
      if (isChecked) {
        return { ...prev, [id]: [...currentArray, value] }
      } else {
        return { ...prev, [id]: currentArray.filter((item) => item !== value) }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let result
    if (formType === "waitlist" || formType === "schedule") {
      const validationErrors = validateLeadForm(formData)
      if (Object.keys(validationErrors).length > 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields for the lead form.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      result = await submitLead({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        formType: formType,
        contactTime: formData.contactTime,
        issueSnapshot: formData.issueSnapshot,
        mailingListConsent: formData.mailingListConsent,
      })
    } else if (formType === "report") {
      const validationErrors = validateReportForm(formData)
      if (Object.keys(validationErrors).length > 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields for the report form.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      result = await submitReport(formData)
    }

    if (result?.success) {
      toast({
        title: "Success!",
        description: result.message,
      })
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        contactTime: "",
        issueSnapshot: "",
        mailingListConsent: false,
        preferredContact: "",
        isVeteran: false,
        hasStreeteasyListing: false,
        streeteasyLink: "",
        manualAddress: "",
        manualPrice: "",
        manualUnit: "",
        manualBedrooms: "",
        manualBathrooms: "",
        borough: "",
        neighborhood: "",
        landlordName: "",
        landlordCompany: "",
        brokerName: "",
        brokerCompany: "",
        brokerageName: "",
        businessAddress: "",
        contactedBusiness: false,
        employeeName: "",
        whatHappened: "",
        outcome: "",
        violations: [],
        violationOthers: [],
        illegalBrokerFeeCharged: false,
        requirementToUseBroker: false,
        feesNotDisclosed: false,
        feesNotDisclosedText: "",
        improperFeesInAd: false,
        improperFeesInAdUrl: "",
        feeCharges: [],
        feeChargesOther: "",
        narrative: "",
        additionalContext: "",
        desiredOutcomeArray: [],
        desiredOutcomeOther: "",
        aiRefinementOption: "",
        reportDescription: "",
        referralSource: "",
        referralSourceOther: "",
        dcwpConsent: false,
        proxyConsent: false,
        documentInfo: [],
      })
      router.push("/thank-you") // Redirect to a thank you page
    } else {
      toast({
        title: "Error",
        description: result?.message || "An unknown error occurred.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Test Forms</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={formType} onValueChange={setFormType} className="flex space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="waitlist" id="waitlist" />
              <Label htmlFor="waitlist">Waitlist Form</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="schedule" id="schedule" />
              <Label htmlFor="schedule">Schedule Form</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="report" id="report" />
              <Label htmlFor="report">Report Form</Label>
            </div>
          </RadioGroup>

          {/* Common Fields */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" value={formData.phone} onChange={handleChange} />
          </div>

          {(formType === "waitlist" || formType === "schedule") && (
            <>
              {formType === "schedule" && (
                <div>
                  <Label htmlFor="contactTime">Preferred Contact Time</Label>
                  <Input id="contactTime" value={formData.contactTime} onChange={handleChange} />
                </div>
              )}
              <div>
                <Label htmlFor="issueSnapshot">Issue Snapshot</Label>
                <Textarea id="issueSnapshot" value={formData.issueSnapshot} onChange={handleChange} />
              </div>
            </>
          )}

          {formType === "report" && (
            <>
              {/* Personal Information */}
              <div>
                <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("preferredContact", value)}
                  value={formData.preferredContact}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVeteran"
                  checked={formData.isVeteran}
                  onCheckedChange={(checked) => handleSelectChange("isVeteran", checked as unknown as string)}
                />
                <Label htmlFor="isVeteran">Are you a veteran?</Label>
              </div>

              {/* Property Information */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Property Information</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasStreeteasyListing"
                  checked={formData.hasStreeteasyListing}
                  onCheckedChange={(checked) =>
                    handleSelectChange("hasStreeteasyListing", checked as unknown as string)
                  }
                />
                <Label htmlFor="hasStreeteasyListing">Do you have a StreetEasy listing?</Label>
              </div>
              {formData.hasStreeteasyListing && (
                <div>
                  <Label htmlFor="streeteasyLink">StreetEasy Link</Label>
                  <Input id="streeteasyLink" value={formData.streeteasyLink} onChange={handleChange} />
                </div>
              )}
              {!formData.hasStreeteasyListing && (
                <>
                  <div>
                    <Label htmlFor="manualAddress">Manual Address</Label>
                    <Input id="manualAddress" value={formData.manualAddress} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="manualPrice">Manual Price</Label>
                    <Input id="manualPrice" value={formData.manualPrice} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="manualUnit">Manual Unit</Label>
                    <Input id="manualUnit" value={formData.manualUnit} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="manualBedrooms">Manual Bedrooms</Label>
                    <Input id="manualBedrooms" value={formData.manualBedrooms} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="manualBathrooms">Manual Bathrooms</Label>
                    <Input id="manualBathrooms" value={formData.manualBathrooms} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="borough">Borough</Label>
                    <Input id="borough" value={formData.borough} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Neighborhood</Label>
                    <Input id="neighborhood" value={formData.neighborhood} onChange={handleChange} />
                  </div>
                </>
              )}

              {/* Business Information */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Business Information</h3>
              <div>
                <Label htmlFor="landlordName">Landlord Name</Label>
                <Input id="landlordName" value={formData.landlordName} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="landlordCompany">Landlord Company</Label>
                <Input id="landlordCompany" value={formData.landlordCompany} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="brokerName">Broker Name</Label>
                <Input id="brokerName" value={formData.brokerName} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="brokerCompany">Broker Company</Label>
                <Input id="brokerCompany" value={formData.brokerCompany} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="brokerageName">Brokerage Name</Label>
                <Input id="brokerageName" value={formData.brokerageName} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input id="businessAddress" value={formData.businessAddress} onChange={handleChange} />
              </div>

              {/* Contact Information */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Contact Information</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contactedBusiness"
                  checked={formData.contactedBusiness}
                  onCheckedChange={(checked) => handleSelectChange("contactedBusiness", checked as unknown as string)}
                />
                <Label htmlFor="contactedBusiness">Have you contacted the business?</Label>
              </div>
              {formData.contactedBusiness && (
                <>
                  <div>
                    <Label htmlFor="employeeName">Employee Name (if applicable)</Label>
                    <Input id="employeeName" value={formData.employeeName} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="whatHappened">What happened when you contacted them?</Label>
                    <Textarea id="whatHappened" value={formData.whatHappened} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="outcome">What was the outcome?</Label>
                    <Textarea id="outcome" value={formData.outcome} onChange={handleChange} />
                  </div>
                </>
              )}

              {/* Violations */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Violations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Illegal Broker Fee",
                  "Unlicensed Broker",
                  "Discrimination",
                  "Harassment",
                  "Unsafe Conditions",
                  "Lease Issues",
                  "Rent Overcharge",
                  "Eviction Issues",
                ].map((violation) => (
                  <div key={violation} className="flex items-center space-x-2">
                    <Checkbox
                      id={`violation-${violation.replace(/\s/g, "")}`}
                      checked={formData.violations.includes(violation)}
                      onCheckedChange={(checked) =>
                        handleCheckboxGroupChange("violations", violation, checked as boolean)
                      }
                    />
                    <Label htmlFor={`violation-${violation.replace(/\s/g, "")}`}>{violation}</Label>
                  </div>
                ))}
              </div>
              <div>
                <Label htmlFor="violationOthers">Other Violations (JSON array of strings)</Label>
                <Textarea
                  id="violationOthers"
                  value={JSON.stringify(formData.violationOthers)}
                  onChange={(e) => {
                    try {
                      setFormData((prev) => ({ ...prev, violationOthers: JSON.parse(e.target.value) }))
                    } catch (error) {
                      // Handle invalid JSON input
                      console.error("Invalid JSON for other violations:", error)
                    }
                  }}
                />
              </div>

              {/* DCWP Fee Details */}
              <h3 className="text-lg font-semibold mt-6 mb-2">DCWP Fee Details</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="illegalBrokerFeeCharged"
                  checked={formData.illegalBrokerFeeCharged}
                  onCheckedChange={(checked) =>
                    handleSelectChange("illegalBrokerFeeCharged", checked as unknown as string)
                  }
                />
                <Label htmlFor="illegalBrokerFeeCharged">Illegal broker fee charged?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requirementToUseBroker"
                  checked={formData.requirementToUseBroker}
                  onCheckedChange={(checked) =>
                    handleSelectChange("requirementToUseBroker", checked as unknown as string)
                  }
                />
                <Label htmlFor="requirementToUseBroker">Requirement to use broker?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="feesNotDisclosed"
                  checked={formData.feesNotDisclosed}
                  onCheckedChange={(checked) => handleSelectChange("feesNotDisclosed", checked as unknown as string)}
                />
                <Label htmlFor="feesNotDisclosed">Fees not disclosed?</Label>
              </div>
              {formData.feesNotDisclosed && (
                <div>
                  <Label htmlFor="feesNotDisclosedText">Details on undisclosed fees</Label>
                  <Textarea id="feesNotDisclosedText" value={formData.feesNotDisclosedText} onChange={handleChange} />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="improperFeesInAd"
                  checked={formData.improperFeesInAd}
                  onCheckedChange={(checked) => handleSelectChange("improperFeesInAd", checked as unknown as string)}
                />
                <Label htmlFor="improperFeesInAd">Improper fees in ad?</Label>
              </div>
              {formData.improperFeesInAd && (
                <div>
                  <Label htmlFor="improperFeesInAdUrl">URL of ad with improper fees</Label>
                  <Input id="improperFeesInAdUrl" value={formData.improperFeesInAdUrl} onChange={handleChange} />
                </div>
              )}

              {/* Fee Charges */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Fee Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Application Fee",
                  "Credit Check Fee",
                  "Broker Fee",
                  "Other Admin Fee",
                  "Key Fee",
                  "Amenity Fee",
                  "Pet Fee",
                  "Guarantor Fee",
                ].map((fee) => (
                  <div key={fee} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fee-${fee.replace(/\s/g, "")}`}
                      checked={formData.feeCharges.includes(fee)}
                      onCheckedChange={(checked) => handleCheckboxGroupChange("feeCharges", fee, checked as boolean)}
                    />
                    <Label htmlFor={`fee-${fee.replace(/\s/g, "")}`}>{fee}</Label>
                  </div>
                ))}
              </div>
              <div>
                <Label htmlFor="feeChargesOther">Other Fee Charges</Label>
                <Input id="feeChargesOther" value={formData.feeChargesOther} onChange={handleChange} />
              </div>

              {/* Report Details */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Report Details</h3>
              <div>
                <Label htmlFor="narrative">Narrative of what happened</Label>
                <Textarea id="narrative" value={formData.narrative} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="additionalContext">Additional Context</Label>
                <Textarea id="additionalContext" value={formData.additionalContext} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="desiredOutcomeArray">Desired Outcome (JSON array of strings)</Label>
                <Textarea
                  id="desiredOutcomeArray"
                  value={JSON.stringify(formData.desiredOutcomeArray)}
                  onChange={(e) => {
                    try {
                      setFormData((prev) => ({ ...prev, desiredOutcomeArray: JSON.parse(e.target.value) }))
                    } catch (error) {
                      console.error("Invalid JSON for desired outcome:", error)
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="desiredOutcomeOther">Other Desired Outcome</Label>
                <Input id="desiredOutcomeOther" value={formData.desiredOutcomeOther} onChange={handleChange} />
              </div>

              {/* AI Enhancement */}
              <h3 className="text-lg font-semibold mt-6 mb-2">AI Enhancement</h3>
              <div>
                <Label htmlFor="aiRefinementOption">AI Refinement Option</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("aiRefinementOption", value)}
                  value={formData.aiRefinementOption}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summarize">Summarize</SelectItem>
                    <SelectItem value="categorize">Categorize</SelectItem>
                    <SelectItem value="suggest_actions">Suggest Actions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reportDescription">Report Description (AI generated)</Label>
                <Textarea id="reportDescription" value={formData.reportDescription} onChange={handleChange} readOnly />
              </div>

              {/* Referral */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Referral</h3>
              <div>
                <Label htmlFor="referralSource">Referral Source</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("referralSource", value)}
                  value={formData.referralSource}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select referral source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Family</SelectItem>
                    <SelectItem value="search_engine">Search Engine</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.referralSource === "other" && (
                <div>
                  <Label htmlFor="referralSourceOther">Other Referral Source</Label>
                  <Input id="referralSourceOther" value={formData.referralSourceOther} onChange={handleChange} />
                </div>
              )}

              {/* Consents */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Consents</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dcwpConsent"
                  checked={formData.dcwpConsent}
                  onCheckedChange={(checked) => handleSelectChange("dcwpConsent", checked as unknown as string)}
                />
                <Label htmlFor="dcwpConsent">Consent to share with DCWP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proxyConsent"
                  checked={formData.proxyConsent}
                  onCheckedChange={(checked) => handleSelectChange("proxyConsent", checked as unknown as string)}
                />
                <Label htmlFor="proxyConsent">Consent to act as proxy</Label>
              </div>
              <div>
                <Label htmlFor="documentInfo">Document Information (JSON array of objects)</Label>
                <Textarea
                  id="documentInfo"
                  value={JSON.stringify(formData.documentInfo)}
                  onChange={(e) => {
                    try {
                      setFormData((prev) => ({ ...prev, documentInfo: JSON.parse(e.target.value) }))
                    } catch (error) {
                      console.error("Invalid JSON for document info:", error)
                    }
                  }}
                />
              </div>
            </>
          )}

          {/* Common Consent */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mailingListConsent"
              checked={formData.mailingListConsent}
              onCheckedChange={(checked) => handleSelectChange("mailingListConsent", checked as unknown as string)}
            />
            <Label htmlFor="mailingListConsent">Consent to join mailing list</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
