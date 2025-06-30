"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import { submitFareReport, submitLeadForm } from "@/lib/actions"
import { useActionState } from "react"

export default function IntegrationTestPage() {
  const [leadFormState, leadFormAction, isLeadPending] = useActionState(submitLeadForm, null)
  const [fareReportState, fareReportAction, isFarePending] = useActionState(submitFareReport, null)

  const [leadFormData, setLeadFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    formType: "waitlist",
    mailingListConsent: false,
  })

  const [fareReportData, setFareReportData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "",
    isVeteran: false,
    propertyInfoType: "",
    streetEasyLink: "",
    manualAddress: "",
    whoReporting: "",
    managementCompanyName: "",
    agentFirstName: "",
    agentLastName: "",
    brokerageName: "",
    businessAddress: "",
    violations: [],
    narrative: "",
    desiredOutcome: [],
    dcwpConsent: false,
    proxyConsent: false,
    mailingListConsent: false,
    aiRefinementOption: "none",
    reportDescription: "",
    feeCharges: [],
  })

  const handleLeadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setLeadFormData({ ...leadFormData, [name]: (e.target as HTMLInputElement).checked })
    } else {
      setLeadFormData({ ...leadFormData, [name]: value })
    }
  }

  const handleFareReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFareReportData({ ...fareReportData, [name]: (e.target as HTMLInputElement).checked })
    } else {
      setFareReportData({ ...fareReportData, [name]: value })
    }
  }

  const handleLeadSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    Object.entries(leadFormData).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value ? "on" : "off")
      } else {
        formData.append(key, value)
      }
    })
    await leadFormAction(formData)
  }

  const handleFareReportSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    Object.entries(fareReportData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "on" : "off")
      } else {
        formData.append(key, value)
      }
    })
    await fareReportAction(formData)
  }

  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-12">Integration Test Page</h1>

      {/* Lead Form Test */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Lead Form Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <Label htmlFor="lead-firstName">First Name</Label>
              <Input
                id="lead-firstName"
                name="firstName"
                value={leadFormData.firstName}
                onChange={handleLeadChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lead-lastName">Last Name</Label>
              <Input
                id="lead-lastName"
                name="lastName"
                value={leadFormData.lastName}
                onChange={handleLeadChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                name="email"
                type="email"
                value={leadFormData.email}
                onChange={handleLeadChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lead-phone">Phone</Label>
              <Input id="lead-phone" name="phone" type="tel" value={leadFormData.phone} onChange={handleLeadChange} />
            </div>
            <div>
              <Label htmlFor="lead-formType">Form Type</Label>
              <Select
                name="formType"
                value={leadFormData.formType}
                onValueChange={(value) => setLeadFormData({ ...leadFormData, formType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select form type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waitlist">Waitlist</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lead-mailingListConsent"
                name="mailingListConsent"
                checked={leadFormData.mailingListConsent}
                onCheckedChange={(checked) => setLeadFormData({ ...leadFormData, mailingListConsent: !!checked })}
              />
              <Label htmlFor="lead-mailingListConsent">I agree to receive updates</Label>
            </div>
            <Button type="submit" disabled={isLeadPending}>
              {isLeadPending ? "Submitting..." : "Submit Lead Form"}
            </Button>
          </form>
          {leadFormState && (
            <Alert className="mt-4">
              {leadFormState.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle>{leadFormState.success ? "Success!" : "Error!"}</AlertTitle>
              <AlertDescription>{leadFormState.success || leadFormState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* FARE Report Form Test */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>FARE Report Form Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFareReportSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div>
              <Label htmlFor="fare-firstName">First Name</Label>
              <Input
                id="fare-firstName"
                name="firstName"
                value={fareReportData.firstName}
                onChange={handleFareReportChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="fare-lastName">Last Name</Label>
              <Input
                id="fare-lastName"
                name="lastName"
                value={fareReportData.lastName}
                onChange={handleFareReportChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="fare-email">Email</Label>
              <Input
                id="fare-email"
                name="email"
                type="email"
                value={fareReportData.email}
                onChange={handleFareReportChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="fare-phone">Phone</Label>
              <Input
                id="fare-phone"
                name="phone"
                type="tel"
                value={fareReportData.phone}
                onChange={handleFareReportChange}
              />
            </div>
            <div>
              <Label htmlFor="fare-preferredContact">Preferred Contact</Label>
              <Select
                name="preferredContact"
                value={fareReportData.preferredContact}
                onValueChange={(value) => setFareReportData({ ...fareReportData, preferredContact: value })}
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
                id="fare-isVeteran"
                name="isVeteran"
                checked={fareReportData.isVeteran}
                onCheckedChange={(checked) => setFareReportData({ ...fareReportData, isVeteran: !!checked })}
              />
              <Label htmlFor="fare-isVeteran">Are you a veteran?</Label>
            </div>

            <h3 className="text-lg font-semibold mt-6">Property Information</h3>
            <div>
              <Label htmlFor="fare-propertyInfoType">Property Info Type</Label>
              <Select
                name="propertyInfoType"
                value={fareReportData.propertyInfoType}
                onValueChange={(value) => setFareReportData({ ...fareReportData, propertyInfoType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select info type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="streeteasy">StreetEasy Link</SelectItem>
                  <SelectItem value="manual">Manual Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {fareReportData.propertyInfoType === "streeteasy" && (
              <div>
                <Label htmlFor="fare-streetEasyLink">StreetEasy Link</Label>
                <Input
                  id="fare-streetEasyLink"
                  name="streetEasyLink"
                  value={fareReportData.streetEasyLink}
                  onChange={handleFareReportChange}
                />
              </div>
            )}
            {fareReportData.propertyInfoType === "manual" && (
              <div>
                <Label htmlFor="fare-manualAddress">Manual Address</Label>
                <Input
                  id="fare-manualAddress"
                  name="manualAddress"
                  value={fareReportData.manualAddress}
                  onChange={handleFareReportChange}
                />
              </div>
            )}

            <h3 className="text-lg font-semibold mt-6">Who are you reporting?</h3>
            <div>
              <Label htmlFor="fare-whoReporting">Who Reporting</Label>
              <Select
                name="whoReporting"
                value={fareReportData.whoReporting}
                onValueChange={(value) => setFareReportData({ ...fareReportData, whoReporting: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select who you are reporting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="management">Management Company</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="brokerage">Brokerage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {fareReportData.whoReporting === "management" && (
              <div>
                <Label htmlFor="fare-managementCompanyName">Management Company Name</Label>
                <Input
                  id="fare-managementCompanyName"
                  name="managementCompanyName"
                  value={fareReportData.managementCompanyName}
                  onChange={handleFareReportChange}
                />
              </div>
            )}
            {fareReportData.whoReporting === "agent" && (
              <>
                <div>
                  <Label htmlFor="fare-agentFirstName">Agent First Name</Label>
                  <Input
                    id="fare-agentFirstName"
                    name="agentFirstName"
                    value={fareReportData.agentFirstName}
                    onChange={handleFareReportChange}
                  />
                </div>
                <div>
                  <Label htmlFor="fare-agentLastName">Agent Last Name</Label>
                  <Input
                    id="fare-agentLastName"
                    name="agentLastName"
                    value={fareReportData.agentLastName}
                    onChange={handleFareReportChange}
                  />
                </div>
                <div>
                  <Label htmlFor="fare-brokerageName">Brokerage for Agent</Label>
                  <Input
                    id="fare-brokerageName"
                    name="brokerageName"
                    value={fareReportData.brokerageName}
                    onChange={handleFareReportChange}
                  />
                </div>
              </>
            )}
            {fareReportData.whoReporting === "brokerage" && (
              <div>
                <Label htmlFor="fare-brokerageName">Brokerage Name</Label>
                <Input
                  id="fare-brokerageName"
                  name="brokerageName"
                  value={fareReportData.brokerageName}
                  onChange={handleFareReportChange}
                />
              </div>
            )}
            <div>
              <Label htmlFor="fare-businessAddress">Business Address</Label>
              <Input
                id="fare-businessAddress"
                name="businessAddress"
                value={fareReportData.businessAddress}
                onChange={handleFareReportChange}
              />
            </div>

            <h3 className="text-lg font-semibold mt-6">Violations</h3>
            <div className="space-y-2">
              {["Illegal Broker Fee", "Misleading Ad", "Discriminatory Practice", "Other"].map((violation) => (
                <div key={violation} className="flex items-center space-x-2">
                  <Checkbox
                    id={`violation-${violation}`}
                    checked={fareReportData.violations.includes(violation)}
                    onCheckedChange={(checked) => {
                      setFareReportData((prev) => ({
                        ...prev,
                        violations: checked
                          ? [...prev.violations, violation]
                          : prev.violations.filter((v) => v !== violation),
                      }))
                    }}
                  />
                  <Label htmlFor={`violation-${violation}`}>{violation}</Label>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mt-6">Fee Charges</h3>
            <div className="space-y-2">
              {["Broker Fee", "Application Fee", "Security Deposit"].map((charge) => (
                <div key={charge} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fee-charge-${charge}`}
                    checked={fareReportData.feeCharges.includes(charge)}
                    onCheckedChange={(checked) => {
                      setFareReportData((prev) => ({
                        ...prev,
                        feeCharges: checked
                          ? [...prev.feeCharges, charge]
                          : prev.feeCharges.filter((c) => c !== charge),
                      }))
                    }}
                  />
                  <Label htmlFor={`fee-charge-${charge}`}>{charge}</Label>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mt-6">Narrative</h3>
            <div>
              <Label htmlFor="fare-narrative">What happened?</Label>
              <Textarea
                id="fare-narrative"
                name="narrative"
                value={fareReportData.narrative}
                onChange={handleFareReportChange}
                required
              />
            </div>

            <h3 className="text-lg font-semibold mt-6">Desired Outcome</h3>
            <div className="space-y-2">
              {["Refund", "Investigation", "Other"].map((outcome) => (
                <div key={outcome} className="flex items-center space-x-2">
                  <Checkbox
                    id={`outcome-${outcome}`}
                    checked={fareReportData.desiredOutcome.includes(outcome)}
                    onCheckedChange={(checked) => {
                      setFareReportData((prev) => ({
                        ...prev,
                        desiredOutcome: checked
                          ? [...prev.desiredOutcome, outcome]
                          : prev.desiredOutcome.filter((o) => o !== outcome),
                      }))
                    }}
                  />
                  <Label htmlFor={`outcome-${outcome}`}>{outcome}</Label>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mt-6">AI Refinement Option</h3>
            <RadioGroup
              name="aiRefinementOption"
              value={fareReportData.aiRefinementOption}
              onValueChange={(value) => setFareReportData({ ...fareReportData, aiRefinementOption: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="ai-none" />
                <Label htmlFor="ai-none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="refine" id="ai-refine" />
                <Label htmlFor="ai-refine">Refine Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="refine-and-email" id="ai-refine-email" />
                <Label htmlFor="ai-refine-email">Refine and Email</Label>
              </div>
            </RadioGroup>
            {fareReportData.aiRefinementOption !== "none" && (
              <div>
                <Label htmlFor="fare-reportDescription">Report Description (for AI)</Label>
                <Textarea
                  id="fare-reportDescription"
                  name="reportDescription"
                  value={fareReportData.reportDescription}
                  onChange={handleFareReportChange}
                />
              </div>
            )}

            <h3 className="text-lg font-semibold mt-6">Consents</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fare-dcwpConsent"
                name="dcwpConsent"
                checked={fareReportData.dcwpConsent}
                onCheckedChange={(checked) => setFareReportData({ ...fareReportData, dcwpConsent: !!checked })}
                required
              />
              <Label htmlFor="fare-dcwpConsent">I consent to DCWP submission</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fare-proxyConsent"
                name="proxyConsent"
                checked={fareReportData.proxyConsent}
                onCheckedChange={(checked) => setFareReportData({ ...fareReportData, proxyConsent: !!checked })}
                required
              />
              <Label htmlFor="fare-proxyConsent">I consent to proxy submission</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fare-mailingListConsent"
                name="mailingListConsent"
                checked={fareReportData.mailingListConsent}
                onCheckedChange={(checked) => setFareReportData({ ...fareReportData, mailingListConsent: !!checked })}
                required
              />
              <Label htmlFor="fare-mailingListConsent">I agree to receive updates</Label>
            </div>

            <Button type="submit" disabled={isFarePending}>
              {isFarePending ? "Submitting..." : "Submit FARE Report"}
            </Button>
          </form>
          {fareReportState && (
            <Alert className="mt-4">
              {fareReportState.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle>{fareReportState.success ? "Success!" : "Error!"}</AlertTitle>
              <AlertDescription>{fareReportState.success || fareReportState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
