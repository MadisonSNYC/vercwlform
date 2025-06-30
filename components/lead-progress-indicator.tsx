"use client"

import { Progress } from "@/components/ui/progress"

interface LeadProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function LeadProgressIndicator({ currentStep, totalSteps }: LeadProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      <Progress value={progress} className="w-full" />
      <div className="text-sm text-muted-foreground mt-2 text-center">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  )
}
