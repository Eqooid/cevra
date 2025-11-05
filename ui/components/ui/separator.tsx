"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Separator component for dividing content.
 * @component
 * @example
 * ```tsx
 * <Separator orientation="horizontal" />
 * ```
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @param {string} [props.orientation='horizontal'] - The orientation of the separator.
 * @param {boolean} [props.decorative=true] - Whether the separator is decorative.
 * @returns {JSX.Element} The rendered separator component.
 * @author System
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
