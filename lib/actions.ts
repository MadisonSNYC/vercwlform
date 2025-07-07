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

// Server action that handles FormData from forms
export async function submitFareReport(prevState: any, formData: FormData) {
  try {
    const formType = formData.get("formType") as string

    if (formType === "waitlist") {
      const leadData: LeadFormData = {
        email: formData.get("email") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        formType: "waitlist",
        mailingListConsent: formData.get("mailingListConsent") === "on",
      }

      const result = await submitLead(leadData)
      if (result.success) {
        return { success: "Thank you for joining our waitlist! We'll keep you updated on our progress." }
      } else {
        return { error: result.message }
      }
    }

    if (formType === "schedule") {
      const leadData: LeadFormData = {
        email: formData.get("email") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        formType: "schedule",
        contactTime: formData.get("contactTime") as string,
        issueSnapshot: formData.get("issueSnapshot") as string,
        mailingListConsent: formData.get("mailingListConsent") === "on",
      }

      const result = await submitLead(leadData)
      if (result.success) {
        return { success: "Thank you! We'll reach out to schedule your test session." }
      } else {
        return { error: result.message }
      }
    }

    if (formType === "report") {
      const reportData: ReportFormData = {
        email: formData.get("email") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        preferredContact: formData.get("preferredContact") as string,
        isVeteran: formData.get("isVeteran") === "on",
        hasStreeteasyListing: formData.get("hasStreetEasyListing") === "on",
        streeteasyLink: formData.get("streetEasyLink") as string,
        manualAddress: formData.get("manualAddress") as string,
        manualPrice: formData.get("manualPrice") as string,
        manualUnit: formData.get("manualUnit") as string,
        manualBedrooms: formData.get("manualBedrooms") as string,
        manualBathrooms: formData.get("manualBathrooms") as string,
        borough: formData.get("borough") as string,
        neighborhood: formData.get("neighborhood") as string,
        landlordName: formData.get("landlordName") as string,
        landlordCompany: formData.get("landlordCompany") as string,
        brokerName: formData.get("brokerName") as string,
        brokerCompany: formData.get("brokerCompany") as string,
        brokerageName: formData.get("brokerageName") as string,
        businessAddress: formData.get("businessAddress") as string,
        contactedBusiness: formData.get("contactedBusiness") === "on",
        employeeName: formData.get("employeeName") as string,
        whatHappened: formData.get("whatHappened") as string,
        outcome: formData.get("outcome") as string,
        violations: JSON.parse((formData.get("violations") as string) || "[]"),
        violationOthers: JSON.parse((formData.get("violation_others") as string) || "[]"),
        illegalBrokerFeeCharged: formData.get("illegalBrokerFeeCharged") === "on",
        requirementToUseBroker: formData.get("requirementToUseBroker") === "on",
        feesNotDisclosed: formData.get("feesNotDisclosed") === "on",
        feesNotDisclosedText: formData.get("feesNotDisclosedText") as string,
        improperFeesInAd: formData.get("improperFeesInAd") === "on",
        improperFeesInAdUrl: formData.get("improperFeesInAdUrl") as string,
        feeCharges: JSON.parse((formData.get("fee_charges") as string) || "[]"),
        feeChargesOther: formData.get("fee_charges_other") as string,
        narrative: formData.get("narrative") as string,
        additionalContext: formData.get("additionalContext") as string,
        desiredOutcomeArray: JSON.parse((formData.get("desired_outcome_array") as string) || "[]"),
        desiredOutcomeOther: formData.get("desired_outcome_other") as string,
        aiRefinementOption: formData.get("aiRefinementOption") as string,
        reportDescription: formData.get("reportDescription") as string,
        referralSource: formData.get("referralSource") as string,
        referralSourceOther: formData.get("referralSourceOther") as string,
        dcwpConsent: formData.get("dcwpConsent") === "on",
        proxyConsent: formData.get("proxyConsent") === "on",
        mailingListConsent: formData.get("mailingListConsent") === "on",
        documentInfo: JSON.parse((formData.get("document_info") as string) || "[]"),
      }

      const result = await submitReport(reportData)
      if (result.success) {
        return { success: "Thank you for your report! We've received your submission and will process it shortly." }
      } else {
        return { error: result.message }
      }
    }

    return { error: "Invalid form type" }
  } catch (error) {
    console.error("Error in submitFareReport:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Legacy function for direct form submissions
export async function submitLeadForm(formData: FormData) {
  try {
    const leadData: LeadFormData = {
      email: formData.get("email") as string,
      firstName: formData.get("first_name") as string,
      lastName: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
      formType: formData.get("form_type") as "waitlist" | "schedule" | "report",
      mailingListConsent: true, // Assume consent for legacy forms
    }

    return await submitLead(leadData)
  } catch (error) {
    console.error("Error in submitLeadForm:", error)
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}
