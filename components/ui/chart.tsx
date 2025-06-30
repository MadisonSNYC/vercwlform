"use client"

import type * as React from "react"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, CartesianGrid } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell } from "recharts"

// Helper to determine chart type based on data keys
function getChartType(data: any[], dataKeys: string[]) {
  if (!data || data.length === 0 || dataKeys.length === 0) {
    return null
  }

  // Check if it's suitable for a PieChart (single data key, values are numbers)
  if (dataKeys.length === 1 && typeof data[0][dataKeys[0]] === "number") {
    // For PieChart, we typically need a name and a value.
    // Assuming the first key is the value and there's a 'name' key for labels.
    const hasNameKey = data.every((item) => item.name !== undefined)
    if (hasNameKey) {
      return "pie"
    }
  }

  // Check if it's suitable for a BarChart or LineChart (multiple data keys, typically time-series or categories)
  // This is a simplification; more robust logic might inspect data types and distribution.
  if (dataKeys.length > 0) {
    // If there's a 'date' or 'category' like key, it's likely a line or bar chart
    const hasCategoryOrTime = data.every((item) => item.name !== undefined || item.date !== undefined)
    if (hasCategoryOrTime) {
      // Default to BarChart if no specific time-series pattern is detected
      return "bar"
    }
  }

  return null
}

interface DynamicChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>[]
  dataKeys: string[]
  chartType?: "line" | "bar" | "pie"
  categoryKey?: string // For line/bar charts, the key for the x-axis (e.g., 'name', 'date')
  nameKey?: string // For pie charts, the key for the segment name (e.g., 'name')
  valueKey?: string // For pie charts, the key for the segment value (e.g., 'value')
  colors?: string[] // Array of colors for chart elements
}

export function DynamicChart({
  data,
  dataKeys,
  chartType,
  categoryKey = "name", // Default for XAxis
  nameKey = "name", // Default for PieChart segment name
  valueKey = "value", // Default for PieChart segment value
  colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--muted))"],
  className,
  ...props
}: DynamicChartProps) {
  const resolvedChartType = chartType || getChartType(data, dataKeys)

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data available for chart.
      </div>
    )
  }

  const renderChart = () => {
    switch (resolvedChartType) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                dot={false}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        )
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        )
      case "pie":
        return (
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey={nameKey} />} />
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              outerRadius={80}
              fill={colors[0]} // Pie chart typically uses one fill for the whole, or colors are managed per segment
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        )
      default:
        return (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Unsupported chart type or insufficient data.
          </div>
        )
    }
  }

  return (
    <ChartContainer
      config={dataKeys.reduce((acc, key, index) => {
        acc[key] = {
          label: key.charAt(0).toUpperCase() + key.slice(1), // Simple capitalization
          color: colors[index % colors.length],
        }
        return acc
      }, {})}
      className={className}
      {...props}
    >
      {renderChart()}
    </ChartContainer>
  )
}
