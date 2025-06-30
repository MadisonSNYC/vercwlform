"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Workaround for https://github.com/recharts/recharts/issues/3615
const CartesianGrid = (props: React.ComponentProps<typeof RechartsPrimitive.CartesianGrid>) => (
  <RechartsPrimitive.CartesianGrid {...props} />
)

const ChartContext = React.createContext<{
  config: ChartConfig
} | null>(null)

type ChartConfig = {
  [k: string]: {
    label?: string
    icon?: React.ComponentType
  } & (
    | {
        color?: string
        theme?: never
      }
    | {
        color?: never
        theme?: string
      }
  )
}

type ChartContainerProps = {
  config: ChartConfig
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<"div">

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    const id = React.useId()
    if (!config || typeof config !== "object") {
      return null
    }

    const colorConfig = Object.entries(config).filter(([_, item]) => item.color || item.theme)

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-chart={id}
          ref={ref}
          className={cn(
            "flex h-[--chart-height] w-full flex-col [&_.recharts-cartesian-grid]:stroke-border [&_.recharts-default-tooltip]:rounded-lg [&_.recharts-default-tooltip]:border-border [&_.recharts-default-tooltip]:bg-background [&_.recharts-default-tooltip]:shadow-md [&_.recharts-tooltip-cursor]:fill-action/10 [&_.recharts-xAxis]:fill-muted-foreground [&_.recharts-xAxis]:text-sm [&_.recharts-yAxis]:fill-muted-foreground [&_.recharts-yAxis]:text-sm [&_[data-value='']]:fill-muted-foreground [&_svg]:block",
            className,
          )}
          style={
            {
              "--chart-height": "200px",
              ...Object.fromEntries(
                colorConfig.map(([key, item]) => [`--color-${key}`, item.color || `hsl(var(${item.theme}))`]),
              ),
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Tooltip> & React.ComponentPropsWithoutRef<"div">
>(({ active, payload, className, ...props }, ref) => {
  const { config } = useChart()

  if (!active || !payload || payload.length === 0 || !config || typeof config !== "object") {
    return null
  }

  const formattedPayload = payload.map((item) => {
    const key = item.dataKey as keyof typeof config
    const configItem = config[key]

    return {
      ...item,
      color: configItem?.color || item.color,
      value: configItem?.label ? `${configItem.label}: ${item.value}` : item.value,
    }
  })

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-md",
        className,
      )}
      {...props}
    >
      {formattedPayload.map((item, index) => (
        <div key={item.dataKey || index} className="flex items-center justify-between gap-4">
          {item.name && <span className="text-muted-foreground">{item.name}</span>}
          {item.value && (
            <span className="font-mono font-medium text-foreground" style={{ color: item.color }}>
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Legend> & React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const { config } = useChart()

  if (!config || typeof config !== "object") {
    return null
  }

  return (
    <div ref={ref} className={cn("flex flex-wrap items-center justify-center gap-4", className)} {...props}>
      {Object.entries(config).map(([key, item]) => (
        <div key={key} className="flex items-center gap-1.5">
          {item.icon && (
            <item.icon
              className="h-3 w-3 shrink-0"
              style={{
                fill: `var(--color-${key})`,
                stroke: `var(--color-${key})`,
              }}
            />
          )}
          {item.label && <span className="text-xs text-muted-foreground">{item.label}</span>}
        </div>
      ))}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

const ChartCrosshair = RechartsPrimitive.Crosshair

const ChartActiveShape = RechartsPrimitive.ActiveShape

const ChartAxisLabel = RechartsPrimitive.Label

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartCrosshair,
  ChartActiveShape,
  ChartAxisLabel,
  // Recharts
  Area,
  Bar,
  Line,
  Pie,
  Radar,
  RadialBar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
  ReferenceArea,
  Brush,
  ErrorBar,
  LabelList,
  ResponsiveContainer,
} from "recharts"
