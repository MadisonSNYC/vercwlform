"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect("/login?message=Could not authenticate user")
  }

  return redirect("/protected")
}

export async function signUp(formData: FormData) {
  const origin = headers().get("origin")
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return redirect("/login?message=Could not authenticate user")
  }

  return redirect("/login?message=Check email to continue sign in process")
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}

export async function submitLead(formData: FormData) {
  const supabase = createClient()

  const formType = formData.get("form_type") as string
  const email = formData.get("email") as string
  const firstName = formData.get("first_name") as string
  const lastName = formData.get("last_name") as string
  const phone = formData.get("phone") as string
  const contactTime = formData.get("contact_time") as string
  const issueSnapshot = formData.get("issue_snapshot") as string
  const mailingListConsent = formData.get("mailing_list_consent") === "on"

  const { data, error } = await supabase.from("leads").insert([
    {
      form_type: formType,
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      contact_time: contactTime,
      issue_snapshot: issueSnapshot,
      mailing_list_consent: mailingListConsent,
    },
  ])

  if (error) {
    console.error("Error submitting lead:", error)
    return { success: false, message: "Failed to submit lead. Please try again." }
  }

  revalidatePath("/")
  return { success: true, message: "Lead submitted successfully!" }
}

export async function submitReport(formData: FormData) {
  const supabase = createClient()

  // Personal Information
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const preferred_contact = formData.get("preferred_contact") as string
  const is_veteran = formData.get("is_veteran") === "on"

  // Property Information
  const has_streeteasy_listing = formData.get("has_streeteasy_listing") === "on"
  const streeteasy_link = formData.get("streeteasy_link") as string
  const manual_address = formData.get("manual_address") as string
  const manual_price = formData.get("manual_price") as string
  const manual_unit = formData.get("manual_unit") as string
  const manual_bedrooms = formData.get("manual_bedrooms") as string
  const manual_bathrooms = formData.get("manual_bathrooms") as string
  const borough = formData.get("borough") as string
  const neighborhood = formData.get("neighborhood") as string

  // Business Information
  const landlord_name = formData.get("landlord_name") as string
  const landlord_company = formData.get("landlord_company") as string
  const broker_name = formData.get("broker_name") as string
  const broker_company = formData.get("broker_company") as string
  const brokerage_name = formData.get("brokerage_name") as string
  const business_address = formData.get("business_address") as string

  // Contact Information
  const contacted_business = formData.get("contacted_business") === "on"
  const employee_name = formData.get("employee_name") as string
  const what_happened = formData.get("what_happened") as string
  const outcome = formData.get("outcome") as string

  // Violations (assuming these come as JSON strings or arrays from the form)
  const violations = JSON.parse((formData.get("violations") as string) || "[]")
  const violation_others = JSON.parse((formData.get("violation_others") as string) || "[]")

  // DCWP Fee Details
  const illegal_broker_fee_charged = formData.get("illegal_broker_fee_charged") === "on"
  const requirement_to_use_broker = formData.get("requirement_to_use_broker") === "on"
  const fees_not_disclosed = formData.get("fees_not_disclosed") === "on"
  const fees_not_disclosed_text = formData.get("fees_not_disclosed_text") as string
  const improper_fees_in_ad = formData.get("improper_fees_in_ad") === "on"
  const improper_fees_in_ad_url = formData.get("improper_fees_in_ad_url") as string

  // Fee charges
  const fee_charges = JSON.parse((formData.get("fee_charges") as string) || "[]")
  const fee_charges_other = formData.get("fee_charges_other") as string

  // Report Details
  const narrative = formData.get("narrative") as string
  const additional_context = formData.get("additional_context") as string
  const desired_outcome_array = JSON.parse((formData.get("desired_outcome_array") as string) || "[]")
  const desired_outcome_other = formData.get("desired_outcome_other") as string

  // AI Enhancement
  const ai_refinement_option = formData.get("ai_refinement_option") as string
  const report_description = formData.get("report_description") as string

  // Referral
  const referral_source = formData.get("referral_source") as string
  const referral_source_other = formData.get("referral_source_other") as string

  // Consents
  const dcwp_consent = formData.get("dcwp_consent") === "on"
  const proxy_consent = formData.get("proxy_consent") === "on"
  const mailing_list_consent = formData.get("mailing_list_consent") === "on"

  // Document metadata (assuming this comes as a JSON string from the form)
  const document_info = JSON.parse((formData.get("document_info") as string) || "{}")

  const { data, error } = await supabase.from("reports").insert([
    {
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
    },
  ])

  if (error) {
    console.error("Error submitting report:", error)
    return { success: false, message: "Failed to submit report. Please try again." }
  }

  revalidatePath("/")
  return { success: true, message: "Report submitted successfully!" }
}
