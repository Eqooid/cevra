"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * TooltipProvider component for managing tooltip context.
 * @component
 * @param {Object} props - The properties object.
 * @param {number} [props.delayDuration=0] - The delay duration before showing the tooltip.
 * @returns {JSX.Element} The rendered tooltip provider component.
 * @author System
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

/** 
 * Tooltip component for displaying tooltips.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered tooltip component.
 * @author System
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

/**
 * TooltipTrigger component for triggering the tooltip.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered tooltip trigger component.
 * @author System
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * TooltipContent component for displaying the content of the tooltip.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @param {number} [props.sideOffset=0] - The offset from the side of the trigger.
 * @param {React.ReactNode} props.children - The content of the tooltip.
 * @returns {JSX.Element} The rendered tooltip content component.
 * @author System
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
