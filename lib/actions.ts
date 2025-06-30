"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitFareReport(prevState: any, formData: FormData) {
  const supabase = createClient()

  const formType = formData.get("formType") as string
  const email = formData.get("email") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string
  const mailingListConsent = formData.get("mailingListConsent") === "on"

  if (formType === "waitlist") {
    const { data, error } = await supabase
      .from("waitlist_entries")
      .insert([
        {
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          mailing_list_consent: mailingListConsent,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting waitlist entry:", error)
      return { error: "Failed to join waitlist. Please try again." }
    }

    revalidatePath("/")
    return { success: "Successfully joined the waitlist! We will keep you updated." }
  } else if (formType === "report") {
    const hasStreetEasyListing = formData.get("hasStreetEasyListing") === "on"
    const streetEasyLink = formData.get("streetEasyLink") as string
    const manualAddress = formData.get("manualAddress") as string
    const manualPrice = formData.get("manualPrice") as string
    const manualUnit = formData.get("manualUnit") as string
    const manualBedrooms = formData.get("manualBedrooms") as string
    const manualBathrooms = formData.get("manualBathrooms") as string
    const borough = formData.get("borough") as string
    const neighborhood = formData.get("neighborhood") as string

    const whoReporting = formData.get("whoReporting") as string
    const managementCompanyName = formData.get("landlordCompany") as string
    const agentFirstName = formData.get("brokerName")?.split(" ")[0] as string
    const agentLastName = formData.get("brokerName")?.split(" ")[1] as string
    const brokerageName = formData.get("brokerageName") as string
    const brokerageForAgent = formData.get("brokerCompany") as string
    const businessAddress = formData.get("businessAddress") as string
    const businessPhone = formData.get("businessPhone") as string
    const businessEmail = formData.get("businessEmail") as string
    const businessWebsite = formData.get("businessWebsite") as string
    const businessLicense = formData.get("businessLicense") as string

    const contactedBusiness = formData.get("contactedBusiness") === "on"
    const employeeName = formData.get("employeeName") as string
    const whatHappened = formData.get("whatHappened") as string
    const outcome = formData.get("outcome") as string

    const violations: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("violation_") && value === "on") {
        violations.push(key.replace("violation_", ""))
      }
    }
    const violationOtherTexts: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("violationOther_")) {
        violationOtherTexts[key.replace("violationOther_", "")] = value as string
      }
    }

    const illegalBrokerFeeCharged = formData.get("illegalBrokerFeeCharged") === "on"
    const requirementToUseBroker = formData.get("requirementToUseBroker") === "on"
    const feesNotDisclosed = formData.get("feesNotDisclosed") === "on"
    const feesNotDisclosedText = formData.get("feesNotDisclosedText") as string
    const improperFeesInAd = formData.get("improperFeesInAd") === "on"
    const improperFeesInAdUrl = formData.get("improperFeesInAdUrl") as string

    const feeCharges: string[] = formData.getAll("feeCharge") as string[]
    const feeChargesOther = formData.get("feeChargesOther") as string

    const narrative = formData.get("narrative") as string
    const additionalNotes = formData.get("additionalContext") as string
    const desiredOutcome = formData.getAll("desiredOutcome") as string[]
    const desiredOutcomeOther = formData.get("desiredOutcomeOther") as string
    const referralSource = formData.get("referralSource") as string
    const referralSourceOther = formData.get("referralSourceOther") as string

    const aiRefinementOption = formData.get("aiRefinementOption") as string
    const reportDescription = formData.get("reportDescription") as string

    const userEmail = formData.get("email") as string
    const userPhone = formData.get("phone") as string
    const preferredContact = formData.get("preferredContact") as string
    const isVeteran = formData.get("isVeteran") === "on"

    const resendReportToMe = formData.get("resendReportToMe") === "on"
    const dcwpConsent = formData.get("dcwpConsent") === "on"
    const proxyConsent = formData.get("proxyConsent") === "on"

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: userEmail,
          phone: userPhone,
          preferred_contact: preferredContact,
          is_veteran: isVeteran,
          referral_source: referralSource,
          referral_source_other: referralSourceOther,
          mailing_list_consent: mailingListConsent,
          property_info_type: hasStreetEasyListing ? "streeteasy" : "manual",
          streeteasy_link: streetEasyLink,
          manual_address: manualAddress,
          manual_price: manualPrice,
          manual_unit: manualUnit,
          manual_bedrooms: manualBedrooms,
          manual_bathrooms: manualBathrooms,
          borough: borough,
          neighborhood: neighborhood,
          who_reporting: whoReporting,
          management_company_name: managementCompanyName,
          agent_first_name: agentFirstName,
          agent_last_name: agentLastName,
          brokerage_name: brokerageName,
          brokerage_for_agent: brokerageForAgent,
          business_address: businessAddress,
          business_phone: businessPhone,
          business_email: businessEmail,
          business_website: businessWebsite,
          business_license: businessLicense,
          contacted_business: contactedBusiness,
          employee_name: employeeName,
          what_happened: whatHappened,
          outcome: outcome,
          outcome_chips: outcome.split(",").map((s) => s.trim()), // Assuming outcome is comma-separated string
          outcome_other_text: formData.get("outcomeOtherText") as string,
          violations: violations,
          violation_other_texts: violationOtherTexts,
          illegal_broker_fee_charged: illegalBrokerFeeCharged,
          requirement_to_use_broker: requirementToUseBroker,
          fees_not_disclosed: feesNotDisclosed,
          fees_not_disclosed_text: feesNotDisclosedText,
          improper_fees_in_ad: improperFeesInAd,
          improper_fees_in_ad_url: improperFeesInAdUrl,
          fee_charges: feeCharges,
          fee_charges_other: feeChargesOther,
          ai_refinement_option: aiRefinementOption,
          report_description: reportDescription,
          narrative: narrative,
          additional_notes: additionalNotes,
          desired_outcome: desiredOutcome,
          desired_outcome_other: desiredOutcomeOther,
          resend_report_to_me: resendReportToMe,
          dcwp_consent: dcwpConsent,
          proxy_consent: proxyConsent,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting report:", error)
      return { error: "Failed to submit report. Please try again." }
    }

    revalidatePath("/")
    return { success: "Your report has been submitted successfully! Thank you for your contribution." }
  } else if (formType === "schedule") {
    const contactTime = formData.get("contactTime") as string
    const issueSnapshot = formData.get("issueSnapshot") as string

    const { data, error } = await supabase
      .from("scheduled_reports")
      .insert([
        {
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          mailing_list_consent: mailingListConsent,
          best_time_to_reach_you: contactTime,
          brief_issue_snapshot: issueSnapshot,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting scheduled report:", error)
      return { error: "Failed to schedule report. Please try again." }
    }

    revalidatePath("/")
    return { success: "Your report scheduling request has been received. We will contact you shortly!" }
  }

  return { error: "Invalid form type." }
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
