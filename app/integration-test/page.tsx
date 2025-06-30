"use client"

import type React from "react"

import { useState } from "react"
import { submitFareReport } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function IntegrationTestPage() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setResponse(null)

    const formData = new FormData(event.currentTarget)
    const result = await submitFareReport(formData)
    setResponse(result)
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Integration Test Form</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Submit Fare Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div>
                <Label htmlFor="preferredContact">Preferred Contact</Label>
                <Select name="preferredContact">
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
                <Checkbox id="isVeteran" name="isVeteran" />
                <Label htmlFor="isVeteran">Are you a veteran?</Label>
              </div>
            </div>

            {/* Property Information */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Property Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="hasStreeteasyListing" name="hasStreeteasyListing" />
                <Label htmlFor="hasStreeteasyListing">Do you have a StreetEasy listing?</Label>
              </div>
              <div>
                <Label htmlFor="streeteasyLink">StreetEasy Link</Label>
                <Input id="streeteasyLink" name="streeteasyLink" type="url" />
              </div>
              <div>
                <Label htmlFor="manualAddress">Manual Address</Label>
                <Input id="manualAddress" name="manualAddress" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manualPrice">Manual Price</Label>
                  <Input id="manualPrice" name="manualPrice" />
                </div>
                <div>
                  <Label htmlFor="manualUnit">Manual Unit</Label>
                  <Input id="manualUnit" name="manualUnit" />
                </div>
                <div>
                  <Label htmlFor="manualBedrooms">Manual Bedrooms</Label>
                  <Input id="manualBedrooms" name="manualBedrooms" />
                </div>
                <div>
                  <Label htmlFor="manualBathrooms">Manual Bathrooms</Label>
                  <Input id="manualBathrooms" name="manualBathrooms" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="borough">Borough</Label>
                  <Input id="borough" name="borough" />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input id="neighborhood" name="neighborhood" />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Business Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="landlordName">Landlord Name</Label>
                <Input id="landlordName" name="landlordName" />
              </div>
              <div>
                <Label htmlFor="landlordCompany">Landlord Company</Label>
                <Input id="landlordCompany" name="landlordCompany" />
              </div>
              <div>
                <Label htmlFor="brokerName">Broker Name</Label>
                <Input id="brokerName" name="brokerName" />
              </div>
              <div>
                <Label htmlFor="brokerCompany">Broker Company</Label>
                <Input id="brokerCompany" name="brokerCompany" />
              </div>
              <div>
                <Label htmlFor="brokerageName">Brokerage Name</Label>
                <Input id="brokerageName" name="brokerageName" />
              </div>
              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input id="businessAddress" name="businessAddress" />
              </div>
            </div>

            {/* Contact Information */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="contactedBusiness" name="contactedBusiness" />
                <Label htmlFor="contactedBusiness">Have you contacted the business?</Label>
              </div>
              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input id="employeeName" name="employeeName" />
              </div>
              <div>
                <Label htmlFor="whatHappened">What Happened?</Label>
                <Textarea id="whatHappened" name="whatHappened" />
              </div>
              <div>
                <Label htmlFor="outcome">Desired Outcome from Contact</Label>
                <Textarea id="outcome" name="outcome" />
              </div>
            </div>

            {/* Violations */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Violations</h2>
            <div className="space-y-2">
              <Label>Select all applicable violations:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="violation1" name="violations" value="Illegal Broker Fee" />
                  <Label htmlFor="violation1">Illegal Broker Fee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="violation2" name="violations" value="Discrimination" />
                  <Label htmlFor="violation2">Discrimination</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="violation3" name="violations" value="Harassment" />
                  <Label htmlFor="violation3">Harassment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="violation4" name="violations" value="Unsafe Conditions" />
                  <Label htmlFor="violation4">Unsafe Conditions</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="violationOthers">Other Violations (JSON format, e.g., {'key": "value'})</Label>
                <Textarea id="violationOthers" name="violationOthers" placeholder='{"other_violation": "details"}' />
              </div>
            </div>

            {/* DCWP Fee Details */}
            <h2 className="text-xl font-semibold mt-6 mb-2">DCWP Fee Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="illegalBrokerFeeCharged" name="illegalBrokerFeeCharged" />
                <Label htmlFor="illegalBrokerFeeCharged">Illegal broker fee charged?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="requirementToUseBroker" name="requirementToUseBroker" />
                <Label htmlFor="requirementToUseBroker">Requirement to use a specific broker?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="feesNotDisclosed" name="feesNotDisclosed" />
                <Label htmlFor="feesNotDisclosed">Fees not disclosed?</Label>
              </div>
              <div>
                <Label htmlFor="feesNotDisclosedText">Details on undisclosed fees</Label>
                <Textarea id="feesNotDisclosedText" name="feesNotDisclosedText" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="improperFeesInAd" name="improperFeesInAd" />
                <Label htmlFor="improperFeesInAd">Improper fees in advertisement?</Label>
              </div>
              <div>
                <Label htmlFor="improperFeesInAdUrl">URL of advertisement with improper fees</Label>
                <Input id="improperFeesInAdUrl" name="improperFeesInAdUrl" type="url" />
              </div>
            </div>

            {/* Fee Charges */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Fee Charges</h2>
            <div className="space-y-2">
              <Label>Select all applicable fee charges:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="feeCharge1" name="feeCharges" value="Application Fee" />
                  <Label htmlFor="feeCharge1">Application Fee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="feeCharge2" name="feeCharges" value="Broker Fee" />
                  <Label htmlFor="feeCharge2">Broker Fee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="feeCharge3" name="feeCharges" value="Credit Check Fee" />
                  <Label htmlFor="feeCharge3">Credit Check Fee</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="feeChargesOther">Other Fee Charges</Label>
                <Input id="feeChargesOther" name="feeChargesOther" />
              </div>
            </div>

            {/* Report Details */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Report Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="narrative">Narrative</Label>
                <Textarea id="narrative" name="narrative" />
              </div>
              <div>
                <Label htmlFor="additionalContext">Additional Context</Label>
                <Textarea id="additionalContext" name="additionalContext" />
              </div>
              <div>
                <Label>Desired Outcome</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="outcome1" name="desiredOutcomeArray" value="Refund" />
                    <Label htmlFor="outcome1">Refund</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="outcome2" name="desiredOutcomeArray" value="Investigation" />
                    <Label htmlFor="outcome2">Investigation</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="desiredOutcomeOther">Other Desired Outcome</Label>
                <Input id="desiredOutcomeOther" name="desiredOutcomeOther" />
              </div>
            </div>

            {/* AI Enhancement */}
            <h2 className="text-xl font-semibold mt-6 mb-2">AI Enhancement</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="aiRefinementOption">AI Refinement Option</Label>
                <Select name="aiRefinementOption">
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summarize">Summarize</SelectItem>
                    <SelectItem value="expand">Expand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reportDescription">AI Generated Report Description</Label>
                <Textarea id="reportDescription" name="reportDescription" />
              </div>
            </div>

            {/* Referral */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Referral</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="referralSource">Referral Source</Label>
                <Select name="referralSource">
                  <SelectTrigger>
                    <SelectValue placeholder="Select referral source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="search_engine">Search Engine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="referralSourceOther">Other Referral Source</Label>
                <Input id="referralSourceOther" name="referralSourceOther" />
              </div>
            </div>

            {/* Consents */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Consents</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="dcwpConsent" name="dcwpConsent" />
                <Label htmlFor="dcwpConsent">DCWP Consent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="proxyConsent" name="proxyConsent" />
                <Label htmlFor="proxyConsent">Proxy Consent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mailingListConsent" name="mailingListConsent" />
                <Label htmlFor="mailingListConsent">Mailing List Consent</Label>
              </div>
            </div>

            {/* Document Info (Placeholder for file uploads) */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Document Information</h2>
            <div>
              <Label htmlFor="documentInfo">Document Info (e.g., {'file1": "url1'})</Label>
              <Textarea
                id="documentInfo"
                name="documentInfo"
                placeholder='{"lease_agreement": "https://example.com/lease.pdf"}'
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>

            {response && (
              <div
                className={`mt-4 p-3 rounded-md ${response.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {response.success ? response.message : `Error: ${JSON.stringify(response.error)}`}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
