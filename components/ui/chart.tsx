"use client"

import type * as React from "react"
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

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Define types for common chart props
type ChartProps = React.ComponentProps<typeof ChartContainer> & {
  data: Record<string, any>[]
  categories: string[]
  index: string
  type?: "line" | "bar" | "pie" | "radial" | "area"
}

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
    <ChartContainer
      config={{
        [index]: {
          label: index,
          color: "hsl(var(--primary))",
        },
        ...categories.reduce((acc, category) => {
          acc[category] = { label: category, color: "hsl(var(--primary))" }
          return acc
        }, {}),
      }}
      className={className}
      {...props}
    >
      <ChartComponent data={data}>
        <CartesianGrid vertical={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {renderChartElements()}
      </ChartComponent>
    </ChartContainer>
  )
}

export { Chart }
