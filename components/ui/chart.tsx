"use client"

import React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
} from "recharts"
import { cn } from "@/lib/utils"

import {
  ChartContainer as RechartsChartContainer,
  type ChartContainerProps as RechartsChartContainerProps,
} from "@tremor/react"

// Define types for common chart props
type ChartProps = RechartsChartContainerProps & {
  data: Record<string, any>[]
  categories: string[]
  index: string
  type?: "line" | "bar" | "pie" | "radial" | "area"
}

const ChartContainer = React.forwardRef<HTMLDivElement, RechartsChartContainerProps>(({ className, ...props }, ref) => (
  <RechartsChartContainer
    ref={ref}
    className={cn("flex aspect-video items-center justify-center", className)}
    {...props}
  />
))
ChartContainer.displayName = "ChartContainer"

const Chart = ({ data, categories, index, type = "line", className, ...props }: ChartProps) => {
  const ChartComponent =
    type === "line"
      ? LineChart
      : type === "bar"
        ? BarChart
        : type === "pie"
          ? PieChart
          : type === "radial"
            ? RadialBarChart
            : AreaChart

  const renderChartElements = () => {
    switch (type) {
      case "line":
        return categories.map((category) => (
          <Line key={category} dataKey={category} stroke="hsl(var(--primary))" dot={false} />
        ))
      case "bar":
        return categories.map((category) => <Bar key={category} dataKey={category} fill="hsl(var(--primary))" />)
      case "pie":
        return (
          <Pie data={data} dataKey={index} nameKey={categories[0]} outerRadius={80} fill="hsl(var(--primary))" label />
        )
      case "radial":
        return <RadialBar dataKey={index} fill="hsl(var(--primary))" background clockWise />
      case "area":
        return categories.map((category) => (
          <Area key={category} dataKey={category} fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
        ))
      default:
        return null
    }
  }

  return (
    <ChartContainer className={className} {...props}>
      <ChartComponent data={data}>
        <CartesianGrid vertical={false} />
        {/* <ChartTooltip cursor={false} content={<ChartTooltipContent />} /> */}
        {renderChartElements()}
      </ChartComponent>
    </ChartContainer>
  )
}

export { Chart }
