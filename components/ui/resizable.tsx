"use client"

import type React from "react"

import { Resizable as ResizablePrimitive } from "re-resizable"
import { ResizablePanelGroup as ResizablePanelGroupPrimitive } from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePanelGroupPrimitive>) => (
  <ResizablePanelGroupPrimitive
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePanelGroupPrimitive.Handle> & {
  withHandle?: boolean
}) => (
  <ResizablePanelGroupPrimitive.Handle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:h-full after:w-[100px] after:bg-background after:data-[panel-group-direction=vertical]:hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:h-[100px] data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:data-[panel-group-direction=vertical]:flex",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 rounded-sm bg-border after:absolute after:h-16 after:w-1 after:rounded-full after:bg-foreground after:opacity-0 after:data-[panel-group-direction=vertical]:h-1 after:data-[panel-group-direction=vertical]:w-16 after:data-[panel-group-direction=vertical]:after:data-[panel-group-direction=vertical]:opacity-0 group-hover:after:opacity-100 group-data-[panel-group-direction=vertical]:h-3 group-data-[panel-group-direction=vertical]:w-4 group-data-[panel-group-direction=vertical]:after:data-[panel-group-direction=vertical]:opacity-100" />
    )}
  </ResizablePanelGroupPrimitive.Handle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
