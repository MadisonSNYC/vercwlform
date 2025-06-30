"use server"

import { createClient } from "@/lib/supabase/server"

interface ActionResult {
  success?: string
  error?: string
}

// Add after the existing imports
interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  formType: string
}

// Add lead nurturing function
async function sendLeadNurturingEmail(leadData: LeadData) {
  // This would integrate with your email service (SendGrid, Mailchimp, etc.)
  // For now, we'll just log it
  console.log(`Sending nurturing email to ${leadData.email} for ${leadData.formType}`)

  // Example email content based on form type
  const emailContent = {
    report: {
      subject: "Thank you for starting your FARE Act report",
      content: "We're here to help you through the reporting process...",
    },
    schedule: {
      subject: "We'll be in touch soon to schedule your test",
      content: "Thank you for volunteering to help us test the system...",
    },
    waitlist: {
      subject: "Welcome to the NYC FARE Reporter waitlist",
      content: "You're now on the list to be notified when we launch...",
    },
  }

  // In a real implementation, you'd send the actual email here
  return emailContent[leadData.formType as keyof typeof emailContent]
}

// Add function to test database connection
async function testDatabaseConnection() {
  try {
    const supabase = createClient()

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase.from("leads").select("count").limit(1)

    if (connectionError) {
      console.error("Database connection test failed:", connectionError)
      return { connected: false, error: connectionError }
    }

    console.log("Database connection successful")
    return { connected: true, data: connectionTest }
  } catch (error) {
    console.error("Database connection test error:", error)
    return { connected: false, error }
  }
}

export async function submitFareReport(prevState: any, formData: FormData) {
  try {
    const supabase = createClient()
    const formType = formData.get("formType") as string

    console.log("Checking Supabase config:", {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    })

    // Test database connection first
    const connectionTest = await testDatabaseConnection()
    if (!connectionTest.connected) {
      console.error("Database connection failed:", connectionTest.error)
      return {
        error: `Database connection failed: ${
          connectionTest.error?.message || JSON.stringify(connectionTest.error) || "Unknown connection error"
        }`,
      }
    }

    console.log("Processing form submission:", {
      formType,
      timestamp: new Date().toISOString(),
    })

    if (formType === "waitlist") {
      // Handle waitlist submission
      const leadData = {
        email: formData.get("email") as string,
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        form_type: "waitlist",
        mailing_list_consent: formData.get("mailingListConsent") === "on",
        created_at: new Date().toISOString(),
      }

      console.log("Inserting waitlist lead:", leadData)

      // First, let's check if the leads table exists and what columns it has
      const { data: tableInfo, error: tableError } = await supabase.from("leads").select("*").limit(0)

      if (tableError) {
        console.error("Error checking leads table structure:", tableError)
        return {
          error: `Table structure error: ${tableError.message || JSON.stringify(tableError)}. The 'leads' table may not exist or may have permission issues.`,
        }
      }

      const { data, error } = await supabase.from("leads").insert(leadData).select()

      if (error) {
        console.error("Error inserting waitlist lead:", {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return {
          error: `Failed to join waitlist: ${
            error.message ||
            error.details ||
            error.hint ||
            `Error code: ${error.code}` ||
            JSON.stringify(error) ||
            "Unknown database error"
          }`,
        }
      }

      console.log("Waitlist lead inserted successfully:", data)
      return { success: "Thank you for joining our waitlist! We'll notify you when we officially launch." }
    }

    if (formType === "schedule") {
      // Handle schedule submission
      const leadData = {
        email: formData.get("email") as string,
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        form_type: "schedule",
        contact_time: formData.get("contactTime") as string,
        issue_snapshot: formData.get("issueSnapshot") as string,
        mailing_list_consent: formData.get("mailingListConsent") === "on",
        created_at: new Date().toISOString(),
      }

      console.log("Inserting schedule lead:", leadData)

      // Check table structure first
      const { data: tableInfo, error: tableError } = await supabase.from("leads").select("*").limit(0)

      if (tableError) {
        console.error("Error checking leads table structure:", tableError)
        return {
          error: `Table structure error: ${tableError.message || JSON.stringify(tableError)}`,
        }
      }

      const { data, error } = await supabase.from("leads").insert(leadData).select()

      if (error) {
        console.error("Error inserting schedule lead:", {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return {
          error: `Failed to schedule report: ${
            error.message ||
            error.details ||
            error.hint ||
            `Error code: ${error.code}` ||
            JSON.stringify(error) ||
            "Unknown database error"
          }`,
        }
      }

      console.log("Schedule lead inserted successfully:", data)
      return {
        success:
          "Thank you for scheduling your report! We'll email you within 24 hours with simple next steps to submit your report.",
      }
    }

    if (formType === "report") {
      // Handle file uploads without using storage bucket
      const documents = formData.getAll("documents") as File[]
      const documentInfo = []

      for (const file of documents) {
        if (file.size > 0) {
          // Instead of uploading to storage, we'll just store file metadata
          // In a production environment, you might want to use a different storage solution
          documentInfo.push({
            name: file.name,
            size: file.size,
            type: file.type,
            // Note: File content is not stored in this implementation
            // You would need to implement proper file storage here
          })
        }
      }

      // Collect violation data
      const violations = []
      const violationOthers = {}

      // Check for violation checkboxes
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("violation_") && value === "on") {
          violations.push(key.replace("violation_", ""))
        }
        if (key.startsWith("violationOther_")) {
          const violationType = key.replace("violationOther_", "")
          violationOthers[violationType] = value as string
        }
      }

      // Collect desired outcomes
      const desiredOutcomes = formData.getAll("desiredOutcome") as string[]

      // Collect fee charges
      const feeCharges = formData.getAll("feeCharge") as string[]

      const reportData = {
        // Personal Information
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        preferred_contact: formData.get("preferredContact") as string,
        is_veteran: formData.get("isVeteran") === "on",

        // Property Information
        has_streeteasy_listing: formData.get("hasStreetEasyListing") === "on",
        streeteasy_link: formData.get("streetEasyLink") as string,
        manual_address: formData.get("manualAddress") as string,
        manual_price: formData.get("manualPrice") as string,
        manual_unit: formData.get("manualUnit") as string,
        manual_bedrooms: formData.get("manualBedrooms") as string,
        manual_bathrooms: formData.get("manualBathrooms") as string,
        borough: formData.get("borough") as string,
        neighborhood: formData.get("neighborhood") as string,

        // Business Information
        landlord_name: formData.get("landlordName") as string,
        landlord_company: formData.get("landlordCompany") as string,
        broker_name: formData.get("brokerName") as string,
        broker_company: formData.get("brokerCompany") as string,
        brokerage_name: formData.get("brokerageName") as string,
        business_address: formData.get("businessAddress") as string,

        // Contact Information
        contacted_business: formData.get("contactedBusiness") === "on",
        employee_name: formData.get("employeeName") as string,
        what_happened: formData.get("whatHappened") as string,
        outcome: formData.get("outcome") as string,

        // Violations
        violations: violations,
        violation_others: violationOthers,

        // DCWP Fee Details
        illegal_broker_fee_charged:
          formData.get("illegalBrokerFeeCharged") === "on"
            ? true
            : formData.get("illegalBrokerFeeCharged") === "off"
              ? false
              : null,
        requirement_to_use_broker:
          formData.get("requirementToUseBroker") === "on"
            ? true
            : formData.get("requirementToUseBroker") === "off"
              ? false
              : null,
        fees_not_disclosed:
          formData.get("feesNotDisclosed") === "on" ? true : formData.get("feesNotDisclosed") === "off" ? false : null,
        fees_not_disclosed_text: formData.get("feesNotDisclosedText") as string,
        improper_fees_in_ad:
          formData.get("improperFeesInAd") === "on" ? true : formData.get("improperFeesInAd") === "off" ? false : null,
        improper_fees_in_ad_url: formData.get("improperFeesInAdUrl") as string,

        // Fee charges
        fee_charges: feeCharges,
        fee_charges_other: formData.get("feeChargesOther") as string,

        // Report Details
        narrative: formData.get("narrative") as string,
        additional_context: formData.get("additionalContext") as string,
        desired_outcome_array: desiredOutcomes, // Changed from desired_outcome to desired_outcome_array
        desired_outcome_other: formData.get("desiredOutcomeOther") as string,

        // AI Enhancement
        ai_refinement_option: formData.get("aiRefinementOption") as string,
        report_description: formData.get("reportDescription") as string,

        // Referral
        referral_source: formData.get("referralSource") as string,
        referral_source_other: formData.get("referralSourceOther") as string,

        // Consents
        dcwp_consent: formData.get("dcwpConsent") === "on",
        proxy_consent: formData.get("proxyConsent") === "on",
        mailing_list_consent: formData.get("mailingListConsent") === "on",

        // Document metadata (not actual files)
        document_info: documentInfo,

        // Timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("Inserting report data:", {
        ...reportData,
        violations: reportData.violations,
        fee_charges: reportData.fee_charges,
        document_count: documentInfo.length,
      })

      // Check reports table structure first
      const { data: reportsTableInfo, error: reportsTableError } = await supabase.from("reports").select("*").limit(0)

      if (reportsTableError) {
        console.error("Error checking reports table structure:", reportsTableError)
        return {
          error: `Reports table error: ${reportsTableError.message || JSON.stringify(reportsTableError)}. The 'reports' table may not exist or may have permission issues.`,
        }
      }

      // Insert the report
      const { data, error } = await supabase.from("reports").insert(reportData).select()

      if (error) {
        console.error("Error inserting report:", {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return {
          error: `Failed to submit report: ${
            error.message ||
            error.details ||
            error.hint ||
            `Error code: ${error.code}` ||
            JSON.stringify(error) ||
            "Unknown database error"
          }. Please check your data and try again.`,
        }
      }

      console.log("Report inserted successfully:", data)
      return {
        success:
          "Thank you for submitting your FARE Act violation report! We'll process your submission and send it to the appropriate authorities within 48 hours. You'll receive a confirmation email shortly with your report details and next steps.",
      }
    }

    return { error: "Invalid form type" }
  } catch (error) {
    console.error("Server action error:", error)
    return {
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : JSON.stringify(error) || "Unknown error"}. Please try again.`,
    }
  }
}
