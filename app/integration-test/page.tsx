"use client"

import { useState, useEffect } from "react"
import { testDatabaseConnection, submitLead, submitReport } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormState, useFormStatus } from "react-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LeadAnalytics } from "@/components/lead-analytics"
import { LeadProgressIndicator } from "@/components/lead-progress-indicator"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { TikTokIcon } from "@/components/icons/tiktok-icon"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit Report"}
    </Button>
  )
}

export default async function IntegrationTestPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  // Mock data for LeadAnalytics
  const mockLeadData = {
    totalLeads: 1234,
    leadsByFormType: [
      { name: "Waitlist", value: 500 },
      { name: "Schedule", value: 400 },
      { name: "Report", value: 334 },
    ],
    leadsOverTime: [
      { date: "Jan", count: 100 },
      { date: "Feb", count: 120 },
      { date: "Mar", count: 150 },
      { date: "Apr", count: 130 },
      { date: "May", count: 180 },
    ],
  }

  const [dbStatus, setDbStatus] = useState({ success: false, message: "Testing connection..." })
  const [state, formAction] = useFormState(submitReport, {
    success: false,
    message: "",
  })

  useEffect(() => {
    async function checkDb() {
      const status = await testDatabaseConnection()
      setDbStatus(status)
    }
    checkDb()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Integration Test Page</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Authentication Status</h2>
        <Card>
          <CardContent className="p-4">
            {user ? (
              <div className="flex items-center justify-between">
                <p>Logged in as: {user.email}</p>
                <form action="/auth/sign-out" method="post">
                  <Button type="submit">Sign Out</Button>
                </form>
              </div>
            ) : (
              <p>
                Not logged in.{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  Go to Login
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lead Submission Form Test</h2>
        <Card>
          <CardHeader>
            <CardTitle>Submit a Test Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitLead} className="space-y-4">
              <Input type="hidden" name="form_type" value="test_lead" />
              <div>
                <Label htmlFor="lead-first-name">First Name</Label>
                <Input id="lead-first-name" name="first_name" placeholder="John" required />
              </div>
              <div>
                <Label htmlFor="lead-last-name">Last Name</Label>
                <Input id="lead-last-name" name="last_name" placeholder="Doe" required />
              </div>
              <div>
                <Label htmlFor="lead-email">Email</Label>
                <Input id="lead-email" name="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div>
                <Label htmlFor="lead-phone">Phone (Optional)</Label>
                <Input id="lead-phone" name="phone" type="tel" placeholder="123-456-7890" />
              </div>
              <div>
                <Label htmlFor="lead-contact-time">Preferred Contact Time (Optional)</Label>
                <Input id="lead-contact-time" name="contact_time" placeholder="Anytime" />
              </div>
              <div>
                <Label htmlFor="lead-issue-snapshot">Issue Snapshot (Optional)</Label>
                <Textarea id="lead-issue-snapshot" name="issue_snapshot" placeholder="Brief description of issue" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lead-mailing-list-consent" name="mailing_list_consent" />
                <Label htmlFor="lead-mailing-list-consent">Consent to mailing list</Label>
              </div>
              <Button type="submit">Submit Test Lead</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`font-semibold ${dbStatus.success ? "text-green-600" : "text-red-600"}`}>{dbStatus.message}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Fare Report Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Personal Information */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" required />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" required />
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
                <Label htmlFor="preferred_contact">Preferred Contact Method</Label>
                <Select name="preferred_contact">
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
                <Checkbox id="is_veteran" name="is_veteran" />
                <Label htmlFor="is_veteran">Are you a veteran?</Label>
              </div>
            </div>

            {/* Property Information */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Property Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="has_streeteasy_listing" name="has_streeteasy_listing" />
                <Label htmlFor="has_streeteasy_listing">Do you have a StreetEasy listing?</Label>
              </div>
              <div>
                <Label htmlFor="streeteasy_link">StreetEasy Link</Label>
                <Input id="streeteasy_link" name="streeteasy_link" type="url" />
              </div>
              <div>
                <Label htmlFor="manual_address">Manual Address</Label>
                <Input id="manual_address" name="manual_address" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manual_price">Price</Label>
                  <Input id="manual_price" name="manual_price" />
                </div>
                <div>
                  <Label htmlFor="manual_unit">Unit</Label>
                  <Input id="manual_unit" name="manual_unit" />
                </div>
                <div>
                  <Label htmlFor="manual_bedrooms">Bedrooms</Label>
                  <Input id="manual_bedrooms" name="manual_bedrooms" />
                </div>
                <div>
                  <Label htmlFor="manual_bathrooms">Bathrooms</Label>
                  <Input id="manual_bathrooms" name="manual_bathrooms" />
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
            <h2 className="text-xl font-semibold mt-4 mb-2">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="landlord_name">Landlord Name</Label>
                <Input id="landlord_name" name="landlord_name" />
              </div>
              <div>
                <Label htmlFor="landlord_company">Landlord Company</Label>
                <Input id="landlord_company" name="landlord_company" />
              </div>
              <div>
                <Label htmlFor="broker_name">Broker Name</Label>
                <Input id="broker_name" name="broker_name" />
              </div>
              <div>
                <Label htmlFor="broker_company">Broker Company</Label>
                <Input id="broker_company" name="broker_company" />
              </div>
              <div>
                <Label htmlFor="brokerage_name">Brokerage Name</Label>
                <Input id="brokerage_name" name="brokerage_name" />
              </div>
              <div>
                <Label htmlFor="business_address">Business Address</Label>
                <Input id="business_address" name="business_address" />
              </div>
            </div>

            {/* Contact History */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Contact History</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="contacted_business" name="contacted_business" />
                <Label htmlFor="contacted_business">Have you contacted the business?</Label>
              </div>
              <div>
                <Label htmlFor="employee_name">Employee Name (if applicable)</Label>
                <Input id="employee_name" name="employee_name" />
              </div>
              <div>
                <Label htmlFor="what_happened">What happened?</Label>
                <Textarea id="what_happened" name="what_happened" />
              </div>
              <div>
                <Label htmlFor="outcome">Desired Outcome from Contact</Label>
                <Textarea id="outcome" name="outcome" />
              </div>
            </div>

            {/* Violations */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Violations</h2>
            <div className="space-y-2">
              <Label>Select all applicable violations:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="violation_1" name="violations" value="Violation 1" />
                  <Label htmlFor="violation_1">Violation 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="violation_2" name="violations" value="Violation 2" />
                  <Label htmlFor="violation_2">Violation 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="violation_3" name="violations" value="Violation 3" />
                  <Label htmlFor="violation_3">Violation 3</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="violation_others">Other Violations (JSON format, e.g., {'key": "value'})</Label>
                <Input id="violation_others" name="violation_others" defaultValue="{}" />
              </div>
            </div>

            {/* DCWP Fee Details */}
            <h2 className="text-xl font-semibold mt-4 mb-2">DCWP Fee Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="illegal_broker_fee_charged" name="illegal_broker_fee_charged" />
                <Label htmlFor="illegal_broker_fee_charged">Illegal broker fee charged?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="requirement_to_use_broker" name="requirement_to_use_broker" />
                <Label htmlFor="requirement_to_use_broker">Requirement to use broker?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fees_not_disclosed" name="fees_not_disclosed" />
                <Label htmlFor="fees_not_disclosed">Fees not disclosed?</Label>
              </div>
              <div>
                <Label htmlFor="fees_not_disclosed_text">Fees not disclosed details</Label>
                <Input id="fees_not_disclosed_text" name="fees_not_disclosed_text" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="improper_fees_in_ad" name="improper_fees_in_ad" />
                <Label htmlFor="improper_fees_in_ad">Improper fees in ad?</Label>
              </div>
              <div>
                <Label htmlFor="improper_fees_in_ad_url">Improper fees in ad URL</Label>
                <Input id="improper_fees_in_ad_url" name="improper_fees_in_ad_url" type="url" />
              </div>
            </div>

            {/* Fee Charges */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Fee Charges</h2>
            <div className="space-y-2">
              <Label>Select all applicable fee charges:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="fee_charge_1" name="fee_charges" value="Fee Charge 1" />
                  <Label htmlFor="fee_charge_1">Fee Charge 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="fee_charge_2" name="fee_charges" value="Fee Charge 2" />
                  <Label htmlFor="fee_charge_2">Fee Charge 2</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="fee_charges_other">Other Fee Charges</Label>
                <Input id="fee_charges_other" name="fee_charges_other" />
              </div>
            </div>

            {/* Report Details */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Report Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="narrative">Narrative</Label>
                <Textarea id="narrative" name="narrative" required />
              </div>
              <div>
                <Label htmlFor="additional_context">Additional Context</Label>
                <Textarea id="additional_context" name="additional_context" />
              </div>
              <div>
                <Label>Desired Outcome (select all that apply, JSON array)</Label>
                <Input id="desired_outcome_array" name="desired_outcome_array" defaultValue="[]" />
              </div>
              <div>
                <Label htmlFor="desired_outcome_other">Other Desired Outcome</Label>
                <Input id="desired_outcome_other" name="desired_outcome_other" />
              </div>
            </div>

            {/* AI Enhancement */}
            <h2 className="text-xl font-semibold mt-4 mb-2">AI Enhancement</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai_refinement_option">AI Refinement Option</Label>
                <Select name="ai_refinement_option">
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summarize">Summarize</SelectItem>
                    <SelectItem value="expand">Expand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="report_description">Report Description (AI generated)</Label>
                <Textarea id="report_description" name="report_description" />
              </div>
            </div>

            {/* Referral */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Referral</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="referral_source">Referral Source</Label>
                <Select name="referral_source">
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="referral_source_other">Other Referral Source</Label>
                <Input id="referral_source_other" name="referral_source_other" />
              </div>
            </div>

            {/* Consents */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Consents</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="dcwp_consent" name="dcwp_consent" />
                <Label htmlFor="dcwp_consent">DCWP Consent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="proxy_consent" name="proxy_consent" />
                <Label htmlFor="proxy_consent">Proxy Consent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mailing_list_consent" name="mailing_list_consent" />
                <Label htmlFor="mailing_list_consent">Mailing List Consent</Label>
              </div>
            </div>

            {/* Document Info */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Document Information</h2>
            <div>
              <Label htmlFor="document_info">Document Info (JSON format, e.g., {'filename": "doc.pdf'})</Label>
              <Input id="document_info" name="document_info" defaultValue="{}" />
            </div>

            <SubmitButton />

            {state?.message && (
              <p className={`mt-4 ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</p>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lead Analytics Component Test</h2>
        <LeadAnalytics data={mockLeadData} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lead Progress Indicator Component Test</h2>
        <LeadProgressIndicator currentStep={2} totalSteps={5} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">TikTok Icon Test</h2>
        <div className="flex items-center space-x-4">
          <TikTokIcon className="h-8 w-8 text-gray-800" />
          <TikTokIcon className="h-12 w-12 text-blue-500" />
          <TikTokIcon className="h-16 w-16 text-red-500" />
        </div>
      </div>
    </div>
  )
}
