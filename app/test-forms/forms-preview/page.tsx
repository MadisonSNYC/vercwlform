"use client"

import { useState } from "react"
import { LeadCaptureForm } from "@/components/forms/lead-capture-form"
import { ReportForm } from "@/components/forms/report-form"
import { ThankYouSection } from "@/components/forms/thank-you-section"
import type { FormType } from "@/lib/constants"
import LeadProgressIndicator from "@/components/lead-progress-indicator"
import LeadAnalytics from "@/components/lead-analytics"

export default function FormsPreviewPage() {
  const [formType, setFormType] = useState<FormType>("lead")
  const [showThankYou, setShowThankYou] = useState(false)

  const handleFormSubmitSuccess = () => {
    setShowThankYou(true)
  }

  const handleBackToForms = () => {
    setShowThankYou(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Forms Preview</h1>

      <div className="mb-6 flex space-x-4">
        <button
          className={`rounded-md px-4 py-2 ${formType === "lead" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFormType("lead")}
        >
          Lead Capture Form
        </button>
        <button
          className={`rounded-md px-4 py-2 ${formType === "report" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFormType("report")}
        >
          Report Form
        </button>
      </div>

      {showThankYou ? (
        <ThankYouSection onBackToForms={handleBackToForms} />
      ) : (
        <>
          {formType === "lead" && (
            <>
              <LeadCaptureForm onSubmitSuccess={handleFormSubmitSuccess} />
              <LeadProgressIndicator />
              <LeadAnalytics />
            </>
          )}
          {formType === "report" && <ReportForm onSubmitSuccess={handleFormSubmitSuccess} />}
        </>
      )}
    </div>
  )
}
