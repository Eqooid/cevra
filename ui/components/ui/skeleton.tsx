import { cn } from "@/lib/utils"

/**
 * Skeleton component for displaying loading placeholders.
 * @component
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-full" />
 * ```
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered skeleton component.
 * @author System
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
