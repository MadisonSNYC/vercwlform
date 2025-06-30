"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function submitLead(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get("email") as string
  const firstName = formData.get("first_name") as string
  const lastName = formData.get("last_name") as string
  const phone = formData.get("phone") as string | null
  const formType = formData.get("form_type") as "waitlist" | "schedule" | "report"
  const contactTime = formData.get("contact_time") as string | null
  const issueSnapshot = formData.get("issue_snapshot") as string | null
  const mailingListConsent = formData.get("mailing_list_consent") === "on"

  const { data, error } = await supabase
    .from("leads")
    .insert({
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      form_type: formType,
      contact_time: contactTime,
      issue_snapshot: issueSnapshot,
      mailing_list_consent: mailingListConsent,
    })
    .select()

  if (error) {
    console.error("Error inserting lead:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/")
  return { success: true, message: "Lead submitted successfully!", data }
}

export async function submitReport(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Personal Information
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string | null
  const preferred_contact = formData.get("preferred_contact") as string | null
  const is_veteran = formData.get("is_veteran") === "on"

  // Property Information
  const has_streeteasy_listing = formData.get("has_streeteasy_listing") === "on"
  const streeteasy_link = formData.get("streeteasy_link") as string | null
  const manual_address = formData.get("manual_address") as string | null
  const manual_price = formData.get("manual_price") as string | null
  const manual_unit = formData.get("manual_unit") as string | null
  const manual_bedrooms = formData.get("manual_bedrooms") as string | null
  const manual_bathrooms = formData.get("manual_bathrooms") as string | null
  const borough = formData.get("borough") as string | null
  const neighborhood = formData.get("neighborhood") as string | null

  // Business Information
  const landlord_name = formData.get("landlord_name") as string | null
  const landlord_company = formData.get("landlord_company") as string | null
  const broker_name = formData.get("broker_name") as string | null
  const broker_company = formData.get("broker_company") as string | null
  const brokerage_name = formData.get("brokerage_name") as string | null
  const business_address = formData.get("business_address") as string | null

  // Contact Information
  const contacted_business = formData.get("contacted_business") === "on"
  const employee_name = formData.get("employee_name") as string | null
  const what_happened = formData.get("what_happened") as string | null
  const outcome = formData.get("outcome") as string | null

  // Violations (assuming these come as JSON strings or similar from the form)
  const violations = formData.get("violations") ? JSON.parse(formData.get("violations") as string) : null
  const violation_others = formData.get("violation_others")
    ? JSON.parse(formData.get("violation_others") as string)
    : null

  // DCWP Fee Details
  const illegal_broker_fee_charged = formData.get("illegal_broker_fee_charged") === "on"
  const requirement_to_use_broker = formData.get("requirement_to_use_broker") === "on"
  const fees_not_disclosed = formData.get("fees_not_disclosed") === "on"
  const fees_not_disclosed_text = formData.get("fees_not_disclosed_text") as string | null
  const improper_fees_in_ad = formData.get("improper_fees_in_ad") === "on"
  const improper_fees_in_ad_url = formData.get("improper_fees_in_ad_url") as string | null

  // Fee charges
  const fee_charges = formData.get("fee_charges") ? JSON.parse(formData.get("fee_charges") as string) : null
  const fee_charges_other = formData.get("fee_charges_other") as string | null

  // Report Details
  const narrative = formData.get("narrative") as string | null
  const additional_context = formData.get("additional_context") as string | null
  const desired_outcome_array = formData.get("desired_outcome_array")
    ? JSON.parse(formData.get("desired_outcome_array") as string)
    : null
  const desired_outcome_other = formData.get("desired_outcome_other") as string | null

  // AI Enhancement
  const ai_refinement_option = formData.get("ai_refinement_option") as string | null
  const report_description = formData.get("report_description") as string | null

  // Referral
  const referral_source = formData.get("referral_source") as string | null
  const referral_source_other = formData.get("referral_source_other") as string | null

  // Consents
  const dcwp_consent = formData.get("dcwp_consent") === "on"
  const proxy_consent = formData.get("proxy_consent") === "on"
  const mailing_list_consent = formData.get("mailing_list_consent") === "on"

  // Document metadata (assuming this comes as JSON string or similar)
  const document_info = formData.get("document_info") ? JSON.parse(formData.get("document_info") as string) : null

  const { data, error } = await supabase
    .from("reports")
    .insert({
      first_name,
      last_name,
      email,
      phone,
      preferred_contact,
      is_veteran,
      has_streeteasy_listing,
      streeteasy_link,
      manual_address,
      manual_price,
      manual_unit,
      manual_bedrooms,
      manual_bathrooms,
      borough,
      neighborhood,
      landlord_name,
      landlord_company,
      broker_name,
      broker_company,
      brokerage_name,
      business_address,
      contacted_business,
      employee_name,
      what_happened,
      outcome,
      violations,
      violation_others,
      illegal_broker_fee_charged,
      requirement_to_use_broker,
      fees_not_disclosed,
      fees_not_disclosed_text,
      improper_fees_in_ad,
      improper_fees_in_ad_url,
      fee_charges,
      fee_charges_other,
      narrative,
      additional_context,
      desired_outcome_array,
      desired_outcome_other,
      ai_refinement_option,
      report_description,
      referral_source,
      referral_source_other,
      dcwp_consent,
      proxy_consent,
      mailing_list_consent,
      document_info,
    })
    .select()

  if (error) {
    console.error("Error inserting report:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/")
  return { success: true, message: "Report submitted successfully!", data }
}
