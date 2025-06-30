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

export async function submitLeadForm(formData: FormData) {
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
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      contact_time: contactTime,
      issue_snapshot: issueSnapshot,
      mailing_list_consent: mailingListConsent,
    },
  ])

  if (error) {
    console.error("Error submitting lead form:", error)
    return { success: false, message: "Failed to submit form. Please try again." }
  }

  revalidatePath("/")
  return { success: true, message: "Form submitted successfully!" }
}

export async function submitFareReport(prevState: any, formData: FormData) {
  const supabase = createClient()

  const reportData = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    preferred_contact: formData.get("preferred_contact") as string,
    is_veteran: formData.get("is_veteran") === "on",

    has_streeteasy_listing: formData.get("has_streeteasy_listing") === "on",
    streeteasy_link: formData.get("streeteasy_link") as string,
    manual_address: formData.get("manual_address") as string,
    manual_price: formData.get("manual_price") as string,
    manual_unit: formData.get("manual_unit") as string,
    manual_bedrooms: formData.get("manual_bedrooms") as string,
    manual_bathrooms: formData.get("manual_bathrooms") as string,
    borough: formData.get("borough") as string,
    neighborhood: formData.get("neighborhood") as string,

    landlord_name: formData.get("landlord_name") as string,
    landlord_company: formData.get("landlord_company") as string,
    broker_name: formData.get("broker_name") as string,
    broker_company: formData.get("broker_company") as string,
    brokerage_name: formData.get("brokerage_name") as string,
    business_address: formData.get("business_address") as string,

    contacted_business: formData.get("contacted_business") === "on",
    employee_name: formData.get("employee_name") as string,
    what_happened: formData.get("what_happened") as string,
    outcome: formData.get("outcome") as string,

    violations: JSON.parse((formData.get("violations") as string) || "[]"),
    violation_others: JSON.parse((formData.get("violation_others") as string) || "[]"),

    illegal_broker_fee_charged: formData.get("illegal_broker_fee_charged") === "on",
    requirement_to_use_broker: formData.get("requirement_to_use_broker") === "on",
    fees_not_disclosed: formData.get("fees_not_disclosed") === "on",
    fees_not_disclosed_text: formData.get("fees_not_disclosed_text") as string,
    improper_fees_in_ad: formData.get("improper_fees_in_ad") === "on",
    improper_fees_in_ad_url: formData.get("improper_fees_in_ad_url") as string,

    fee_charges: JSON.parse((formData.get("fee_charges") as string) || "[]"),
    fee_charges_other: formData.get("fee_charges_other") as string,

    narrative: formData.get("narrative") as string,
    additional_context: formData.get("additional_context") as string,
    desired_outcome_array: JSON.parse((formData.get("desired_outcome_array") as string) || "[]"),
    desired_outcome_other: formData.get("desired_outcome_other") as string,

    ai_refinement_option: formData.get("ai_refinement_option") as string,
    report_description: formData.get("report_description") as string,

    referral_source: formData.get("referral_source") as string,
    referral_source_other: formData.get("referral_source_other") as string,

    dcwp_consent: formData.get("dcwp_consent") === "on",
    proxy_consent: formData.get("proxy_consent") === "on",
    mailing_list_consent: formData.get("mailing_list_consent") === "on",

    document_info: JSON.parse((formData.get("document_info") as string) || "[]"),
  }

  const { data, error } = await supabase.from("reports").insert([reportData])

  if (error) {
    console.error("Error submitting report form:", error)
    return { success: false, message: "Failed to submit report. Please try again." }
  }

  revalidatePath("/")
  return { success: true, message: "Report submitted successfully!" }
}

export async function testDatabaseConnection() {
  const supabase = createClient()
  try {
    const { data, error } = await supabase.from("reports").select("id").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, message: `Connection failed: ${error.message}` }
    }

    return { success: true, message: "Supabase connection successful!" }
  } catch (e: any) {
    console.error("Supabase connection test failed (exception):", e)
    return { success: false, message: `Connection failed: ${e.message}` }
  }
}
