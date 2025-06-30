"use client"

import { useState, useEffect } from "react"
import { submitFareReport } from "@/lib/actions"
import { useActionState } from "react"
import ScrollToTopButton from "@/components/layout/scroll-to-top-button"
import ReportForm from "@/components/forms/report-form"
import MainFooter from "@/components/layout/main-footer"
import LeadCaptureForm from "@/components/forms/lead-capture-form"
import ThankYouSection from "@/components/forms/thank-you-section"
import Toaster from "@/components/ui/toaster"
import type { FormType } from "@/lib/constants"
import type { ActionResult } from "@/lib/actions"
import { createClient } from "@/lib/supabase/server"
import { MainNavigation } from "@/components/layout/main-navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { AboutSection } from "@/components/sections/about-section"
import { FAQSection } from "@/components/sections/faq-section"
import { SupportThisWorkSection } from "@/components/sections/support-this-work-section"
import { MadisonStorySection } from "@/components/sections/madison-story-section"

interface InitialLeadData {
  firstName: string
  lastName: string
  email: string
  phone: string
  selectedForm: FormType | ""
  mailingListConsent: boolean
}

export default async function Home() {
  const supabase = createClient()

  // Fetch total leads
  const { count: totalLeads, error: leadsError } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })

  if (leadsError) {
    console.error("Error fetching total leads:", leadsError)
  }

  // Fetch leads by zip code for analytics
  const { data: leadsByZipCodeData, error: zipCodeError } = await supabase
    .from("leads")
    .select("zip_code, count")
    .order("count", { ascending: false })
    .limit(5)
    .returns<{ zip_code: string; count: number }[]>()

  if (zipCodeError) {
    console.error("Error fetching leads by zip code:", zipCodeError)
  }

  const formattedLeadsByZipCode =
    leadsByZipCodeData?.map((item) => ({
      name: item.zip_code,
      leads: item.count,
    })) || []

  const currentLeads = totalLeads || 0
  const goalLeads = 1000 // Example goal

  const [scrollY, setScrollY] = useState<number>(0)
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false)
  const [submitState, submitAction, isPending] = useActionState<ActionResult, FormData>(submitFareReport, null)
  const [thankYouMessage, setThankYouMessage] = useState<string | null>(null)

  const [step, setStep] = useState(1)
  const [leadData, setLeadData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedForm: "" as FormType | "",
    mailingListConsent: false,
  })

  const formType: FormType = "lead" // Default form type

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (submitState?.success) {
      setThankYouMessage(submitState.message || "Form submitted successfully!")
      // Scroll to confirmation section if it exists
      setTimeout(() => {
        document.getElementById("confirmation")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [submitState])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLeadCaptured = (data: typeof leadData) => {
    setLeadData(data)
    setStep(2)
    // Smooth scroll to report form after lead capture
    setTimeout(() => {
      document.getElementById("report-form")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleReportSubmitted = () => {
    setStep(3)
  }

  const resetAllForms = () => {
    setStep(1)
    setLeadData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      selectedForm: "",
      mailingListConsent: false,
    })
    setThankYouMessage(null)
    scrollToTop()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <LeadCaptureForm onLeadCaptured={handleLeadCaptured} initialData={leadData} />
        <MadisonStorySection />
        <AboutSection />
        <FAQSection />
        <SupportThisWorkSection />
        {/* Main Form Section */}
        <section id="report-form" className="py-20 bg-[#FAFAF8] relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {step === 1 && <LeadCaptureForm onLeadCaptured={handleLeadCaptured} initialData={leadData} />}

            {step === 2 && (
              <ReportForm
                initialLeadData={leadData}
                submitAction={submitAction}
                isPending={isPending}
                submitState={submitState}
                onReportSubmitted={handleReportSubmitted}
              />
            )}

            {step === 3 && <ThankYouSection message={thankYouMessage} onReset={resetAllForms} />}
          </div>
        </section>
      </main>
      <MainFooter />
      <ScrollToTopButton showScrollTop={showScrollTop} scrollToTop={scrollToTop} />
      <Toaster />
    </div>
  )
}
