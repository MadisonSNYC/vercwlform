"use client"

import { cn } from "@/lib/utils"

import * as React from "react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  Area,
  AreaChart,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const Chart = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof ChartContainer>>(
  ({ className, children, ...props }, ref) => (
    <ChartContainer ref={ref} className={cn("min-h-[200px] w-full", className)} {...props}>
      {children}
    </ChartContainer>
  ),
)
Chart.displayName = "Chart"

export {
  Chart,
  ChartTooltip,
  ChartTooltipContent,
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Scatter,
  ScatterChart,
}
