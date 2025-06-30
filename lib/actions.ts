"use server"

import type { z } from "zod"
import { LeadFormSchema, ReportFormSchema } from "@/components/test-utils/form-validator"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitLeadCapture(values: z.infer<typeof LeadFormSchema>) {
  const validatedFields = LeadFormSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation Error: " + validatedFields.error.flatten().formErrors.join(", "),
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = createClient()
  const { data, error } = await supabase.from("leads").insert([
    {
      full_name: validatedFields.data.fullName,
      email: validatedFields.data.email,
      phone: validatedFields.data.phone,
      address: validatedFields.data.address,
      borough: validatedFields.data.borough,
      lease_term: validatedFields.data.leaseTerm,
      move_in_date: validatedFields.data.moveInDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
      budget: validatedFields.data.budget,
      notes: validatedFields.data.notes,
      payment_method: validatedFields.data.paymentMethod,
      agreed_to_terms: validatedFields.data.agreedToTerms,
    },
  ])

  if (error) {
    console.error("Error inserting lead:", error)
    return { success: false, message: "Database Error: Failed to submit lead." }
  }

  revalidatePath("/")
  return { success: true, message: "Lead submitted successfully!" }
}

export async function submitFareReport(values: z.infer<typeof ReportFormSchema>) {
  const validatedFields = ReportFormSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation Error: " + validatedFields.error.flatten().formErrors.join(", "),
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = createClient()
  const { data, error } = await supabase.from("fare_reports").insert([
    {
      reporter_name: validatedFields.data.reporterName,
      reporter_email: validatedFields.data.reporterEmail,
      incident_date: validatedFields.data.incidentDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
      incident_time: validatedFields.data.incidentTime,
      location: validatedFields.data.location,
      borough: validatedFields.data.borough,
      fare_amount: validatedFields.data.fareAmount,
      description: validatedFields.data.description,
      contact_permission: validatedFields.data.contactPermission,
    },
  ])

  if (error) {
    console.error("Error inserting fare report:", error)
    return { success: false, message: "Database Error: Failed to submit fare report." }
  }

  revalidatePath("/")
  return { success: true, message: "Fare report submitted successfully!" }
}
