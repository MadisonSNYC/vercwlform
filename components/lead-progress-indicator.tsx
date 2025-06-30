import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface LeadProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  title: string
  description: string
}

export function LeadProgressIndicator({ currentStep, totalSteps, title, description }: LeadProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <div className="flex items-center gap-2">
          <Progress value={progress} className="w-full" />
          <span className="text-sm font-medium">{`${Math.round(progress)}%`}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{`Step ${currentStep} of ${totalSteps}`}</p>
      </CardContent>
    </Card>
  )
}
