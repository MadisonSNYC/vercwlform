"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Define Zod schema for the report form data
const reportSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  preferredContact: z.string().optional(),
  isVeteran: z.boolean().optional(),
  hasStreeteasyListing: z.boolean().optional(),
  streeteasyLink: z.string().optional(),
  manualAddress: z.string().optional(),
  manualPrice: z.string().optional(),
  manualUnit: z.string().optional(),
  manualBedrooms: z.string().optional(),
  manualBathrooms: z.string().optional(),
  borough: z.string().optional(),
  neighborhood: z.string().optional(),
  landlordName: z.string().optional(),
  landlordCompany: z.string().optional(),
  brokerName: z.string().optional(),
  brokerCompany: z.string().optional(),
  brokerageName: z.string().optional(),
  businessAddress: z.string().optional(),
  contactedBusiness: z.boolean().optional(),
  employeeName: z.string().optional(),
  whatHappened: z.string().optional(),
  outcome: z.string().optional(),
  violations: z.array(z.string()).optional(),
  violationOthers: z.record(z.string(), z.string()).optional(), // Assuming key-value pairs for other violations
  illegalBrokerFeeCharged: z.boolean().optional(),
  requirementToUseBroker: z.boolean().optional(),
  feesNotDisclosed: z.boolean().optional(),
  feesNotDisclosedText: z.string().optional(),
  improperFeesInAd: z.boolean().optional(),
  improperFeesInAdUrl: z.string().optional(),
  feeCharges: z.array(z.string()).optional(),
  feeChargesOther: z.string().optional(),
  narrative: z.string().optional(),
  additionalContext: z.string().optional(),
  desiredOutcomeArray: z.array(z.string()).optional(),
  desiredOutcomeOther: z.string().optional(),
  aiRefinementOption: z.string().optional(),
  reportDescription: z.string().optional(),
  referralSource: z.string().optional(),
  referralSourceOther: z.string().optional(),
  dcwpConsent: z.boolean().optional(),
  proxyConsent: z.boolean().optional(),
  mailingListConsent: z.boolean().optional(),
  documentInfo: z.record(z.string(), z.any()).optional(), // Flexible for document metadata
})

export async function submitFareReport(formData: FormData) {
  const supabase = createClient()

  // Convert FormData to a plain object
  const data = Object.fromEntries(formData.entries())

  // Handle checkbox values (they are only present if checked)
  const processedData = {
    ...data,
    isVeteran: data.isVeteran === "on",
    hasStreeteasyListing: data.hasStreeteasyListing === "on",
    contactedBusiness: data.contactedBusiness === "on",
    illegalBrokerFeeCharged: data.illegalBrokerFeeCharged === "on",
    requirementToUseBroker: data.requirementToUseBroker === "on",
    feesNotDisclosed: data.feesNotDisclosed === "on",
    improperFeesInAd: data.improperFeesInAd === "on",
    dcwpConsent: data.dcwpConsent === "on",
    proxyConsent: data.proxyConsent === "on",
    mailingListConsent: data.mailingListConsent === "on",
    // Convert array-like fields from comma-separated strings if necessary, or handle multiple inputs
    violations: formData.getAll("violations"), // Use getAll for multiple checkboxes/selects
    feeCharges: formData.getAll("feeCharges"),
    desiredOutcomeArray: formData.getAll("desiredOutcomeArray"),
  }

  // Parse and validate the data using Zod
  const parsed = reportSchema.safeParse(processedData)

  if (!parsed.success) {
    console.error("Validation Error:", parsed.error.flatten())
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    preferredContact,
    isVeteran,
    hasStreeteasyListing,
    streeteasyLink,
    manualAddress,
    manualPrice,
    manualUnit,
    manualBedrooms,
    manualBathrooms,
    borough,
    neighborhood,
    landlordName,
    landlordCompany,
    brokerName,
    brokerCompany,
    brokerageName,
    businessAddress,
    contactedBusiness,
    employeeName,
    whatHappened,
    outcome,
    violations,
    violationOthers,
    illegalBrokerFeeCharged,
    requirementToUseBroker,
    feesNotDisclosed,
    feesNotDisclosedText,
    improperFeesInAd,
    improperFeesInAdUrl,
    feeCharges,
    feeChargesOther,
    narrative,
    additionalContext,
    desiredOutcomeArray,
    desiredOutcomeOther,
    aiRefinementOption,
    reportDescription,
    referralSource,
    referralSourceOther,
    dcwpConsent,
    proxyConsent,
    mailingListConsent,
    documentInfo,
  } = parsed.data

  const { error } = await supabase.from("reports").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    preferred_contact: preferredContact,
    is_veteran: isVeteran,
    has_streeteasy_listing: hasStreeteasyListing,
    streeteasy_link: streeteasyLink,
    manual_address: manualAddress,
    manual_price: manualPrice,
    manual_unit: manualUnit,
    manual_bedrooms: manualBedrooms,
    manual_bathrooms: manualBathrooms,
    borough,
    neighborhood,
    landlord_name: landlordName,
    landlord_company: landlordCompany,
    broker_name: brokerName,
    broker_company: brokerCompany,
    brokerage_name: brokerageName,
    business_address: businessAddress,
    contacted_business: contactedBusiness,
    employee_name: employeeName,
    what_happened: whatHappened,
    outcome,
    violations: violations ? JSON.stringify(violations) : null,
    violation_others: violationOthers ? JSON.stringify(violationOthers) : null,
    illegal_broker_fee_charged: illegalBrokerFeeCharged,
    requirement_to_use_broker: requirementToUseBroker,
    fees_not_disclosed: feesNotDisclosed,
    fees_not_disclosed_text: feesNotDisclosedText,
    improper_fees_in_ad: improperFeesInAd,
    improper_fees_in_ad_url: improperFeesInAdUrl,
    fee_charges: feeCharges ? JSON.stringify(feeCharges) : null,
    fee_charges_other: feeChargesOther,
    narrative,
    additional_context: additionalContext,
    desired_outcome_array: desiredOutcomeArray ? JSON.stringify(desiredOutcomeArray) : null,
    desired_outcome_other: desiredOutcomeOther,
    ai_refinement_option: aiRefinementOption,
    report_description: reportDescription,
    referral_source: referralSource,
    referral_source_other: referralSourceOther,
    dcwp_consent: dcwpConsent,
    proxy_consent: proxyConsent,
    mailing_list_consent: mailingListConsent,
    document_info: documentInfo ? JSON.stringify(documentInfo) : null,
  })

  if (error) {
    console.error("Error submitting report form:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/integration-test") // Revalidate the page to show new data
  return { success: true, message: "Report submitted successfully!" }
}

export async function submitLead(formData: FormData) {
  const supabase = createClient()
  const email = formData.get("email") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string
  const formType = formData.get("formType") as string // 'waitlist', 'schedule', 'report'
  const contactTime = formData.get("contactTime") as string
  const issueSnapshot = formData.get("issueSnapshot") as string
  const mailingListConsent = formData.get("mailingListConsent") === "on"

  const { error } = await supabase.from("leads").insert({
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
    form_type: formType,
    contact_time: contactTime,
    issue_snapshot: issueSnapshot,
    mailing_list_consent: mailingListConsent,
  })

  if (error) {
    console.error("Error submitting lead:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  return { success: true, message: "Lead submitted successfully!" }
}
