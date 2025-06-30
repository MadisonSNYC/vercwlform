"use client"

// hooks/use-lead-form.ts
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { LeadFormSchema } from "@/components/test-utils/form-validator"
import { submitLeadCapture } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function useLeadForm(onSubmitSuccess: () => void) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof LeadFormSchema>>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      borough: "Manhattan", // Default value
      leaseTerm: "",
      moveInDate: new Date(),
      budget: 0,
      notes: "",
      paymentMethod: "credit_card", // Default value
      agreedToTerms: false,
    },
  })

  async function onSubmit(values: z.infer<typeof LeadFormSchema>) {
    setIsSubmitting(true)
    const result = await submitLeadCapture(values)
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      })
      onSubmitSuccess()
      form.reset() // Reset form on success
    } else {
      toast({
        title: "Error!",
        description: result.message,
        variant: "destructive",
      })
      console.error("Form submission error:", result.errors)
    }
    setIsSubmitting(false)
  }

  return { form, onSubmit, isSubmitting }
}
