"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

interface LeadFormData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  formType: "waitlist" | "schedule" | "report"
  contactTime?: string
  issueSnapshot?: string
  mailingListConsent: boolean
}

interface ReportFormData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  preferredContact?: string
  isVeteran?: boolean
  hasStreeteasyListing?: boolean
  streeteasyLink?: string
  manualAddress?: string
  manualPrice?: string
  manualUnit?: string
  manualBedrooms?: string
  manualBathrooms?: string
  borough?: string
  neighborhood?: string
  landlordName?: string
  landlordCompany?: string
  brokerName?: string
  brokerCompany?: string
  brokerageName?: string
  businessAddress?: string
  contactedBusiness?: boolean
  employeeName?: string
  whatHappened?: string
  outcome?: string
  violations?: string[]
  violationOthers?: string[]
  illegalBrokerFeeCharged?: boolean
  requirementToUseBroker?: boolean
  feesNotDisclosed?: boolean
  feesNotDisclosedText?: string
  improperFeesInAd?: boolean
  improperFeesInAdUrl?: string
  feeCharges?: string[]
  feeChargesOther?: string
  narrative: string
  additionalContext?: string
  desiredOutcomeArray?: string[]
  desiredOutcomeOther?: string
  aiRefinementOption?: string
  reportDescription?: string
  referralSource?: string
  referralSourceOther?: string
  dcwpConsent?: boolean
  proxyConsent?: boolean
  mailingListConsent?: boolean
  documentInfo?: any[] // Consider a more specific type if structure is known
}

export async function submitLead(formData: LeadFormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("vercel").insert([
    {
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      form_type: formData.formType,
      contact_time: formData.contactTime,
      issue_snapshot: formData.issueSnapshot,
      mailing_list_consent: formData.mailingListConsent,
    },
  ])

  if (error) {
    console.error("Error submitting lead:", error)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Lead submitted successfully!" }
}

export async function submitReport(formData: ReportFormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("reports").insert([
    {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      preferred_contact: formData.preferredContact,
      is_veteran: formData.isVeteran,
      has_streeteasy_listing: formData.hasStreeteasyListing,
      streeteasy_link: formData.streeteasyLink,
      manual_address: formData.manualAddress,
      manual_price: formData.manualPrice,
      manual_unit: formData.manualUnit,
      manual_bedrooms: formData.manualBedrooms,
      manual_bathrooms: formData.manualBathrooms,
      borough: formData.borough,
      neighborhood: formData.neighborhood,
      landlord_name: formData.landlordName,
      landlord_company: formData.landlordCompany,
      broker_name: formData.brokerName,
      broker_company: formData.brokerCompany,
      brokerage_name: formData.brokerageName,
      business_address: formData.businessAddress,
      contacted_business: formData.contactedBusiness,
      employee_name: formData.employeeName,
      what_happened: formData.whatHappened,
      outcome: formData.outcome,
      violations: formData.violations,
      violation_others: formData.violationOthers,
      illegal_broker_fee_charged: formData.illegalBrokerFeeCharged,
      requirement_to_use_broker: formData.requirementToUseBroker,
      fees_not_disclosed: formData.feesNotDisclosed,
      fees_not_disclosed_text: formData.feesNotDisclosedText,
      improper_fees_in_ad: formData.improperFeesInAd,
      improper_fees_in_ad_url: formData.improperFeesInAdUrl,
      fee_charges: formData.feeCharges,
      fee_charges_other: formData.feeChargesOther,
      narrative: formData.narrative,
      additional_context: formData.additionalContext,
      desired_outcome_array: formData.desiredOutcomeArray,
      desired_outcome_other: formData.desiredOutcomeOther,
      ai_refinement_option: formData.aiRefinementOption,
      report_description: formData.reportDescription,
      referral_source: formData.referralSource,
      referral_source_other: formData.referralSourceOther,
      dcwp_consent: formData.dcwpConsent,
      proxy_consent: formData.proxyConsent,
      mailing_list_consent: formData.mailingListConsent,
      document_info: formData.documentInfo,
    },
  ])

  if (error) {
    console.error("Error submitting report:", error)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Report submitted successfully!" }
}
