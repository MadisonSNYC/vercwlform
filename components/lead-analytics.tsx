"use client"

import { useEffect } from "react"

interface LeadAnalyticsProps {
  leadData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    selectedForm: string
  }
  onConversion?: (data: any) => void
}

export function LeadAnalytics({ leadData, onConversion }: LeadAnalyticsProps) {
  useEffect(() => {
    // Track lead capture events
    if (typeof window !== "undefined") {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag("event", "lead_capture", {
          event_category: "engagement",
          event_label: leadData.selectedForm,
          custom_parameters: {
            form_type: leadData.selectedForm,
            has_phone: !!leadData.phone,
          },
        })
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq("track", "Lead", {
          content_category: leadData.selectedForm,
          value: 1,
          currency: "USD",
        })
      }

      // Custom analytics callback
      if (onConversion) {
        onConversion({
          timestamp: new Date().toISOString(),
          formType: leadData.selectedForm,
          hasPhone: !!leadData.phone,
          source: document.referrer || "direct",
        })
      }
    }
  }, [leadData, onConversion])

  return null // This component doesn't render anything
}

// Type declarations for global analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
  }
}
