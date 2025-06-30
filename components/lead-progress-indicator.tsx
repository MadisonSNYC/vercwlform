"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeadProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  title?: string
}

export function LeadProgressIndicator({ currentStep, totalSteps, title }: LeadProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title || "Form Progress"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-full" />
          <span className="text-sm font-medium">{`${Math.round(progress)}%`}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Step {currentStep} of {totalSteps}
        </p>
      </CardContent>
    </Card>
  )
}
