"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * DropdownMenu component as a wrapper for Radix UI DropdownMenu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu component.
 * @author System
 */
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

/**
 * DropdownMenuPortal component for rendering dropdown menu content in a portal.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu portal component.
 * @author System
 */
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

/**
 * DropdownMenuTrigger component for triggering the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu trigger component.
 * @author System
 */
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

/**
 * DropdownMenuContent component for displaying the content of the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @param {number} [props.sideOffset=4] - The side offset for the dropdown menu.
 * @returns {JSX.Element} The rendered dropdown menu content component.
 * @author System
 */
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

/**
 * DropdownMenuGroup component for grouping dropdown menu items.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu group component.
 * @author System
 */
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

/**
 * DropdownMenuItem component for individual items in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @param {boolean} [props.inset] - Whether to apply inset styling.
 * @param {string} [props.variant='default'] - The variant of the dropdown menu item.
 * @returns {JSX.Element} The rendered dropdown menu item component.
 * @author System 
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * DropdownMenuCheckboxItem component for checkbox items in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @param {boolean} [props.checked] - Whether the checkbox item is checked.
 * @returns {JSX.Element} The rendered dropdown menu checkbox item component.
 * @author System
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

/**
 * DropdownMenuRadioGroup component for grouping radio items in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu radio group component.
 * @author System
 */
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

/**
 * DropdownMenuRadioItem component for radio items in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu radio item component.
 * @author System
 */
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

/**
 * DropdownMenuLabel component for displaying labels in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @param {boolean} [props.inset] - Whether to apply inset styling.
 * @returns {JSX.Element} The rendered dropdown menu label component.
 * @author System
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/**
 * DropdownMenuSeparator component for separating items in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu separator component.
 * @author System
 */
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/**
 * DropdownMenuShortcut component for displaying keyboard shortcuts in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu shortcut component.
 * @author System
 */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

/**
 * DropdownMenuSub component for creating submenus in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu sub component.
 * @author System
 */
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

/**
 * DropdownMenuSubTrigger component for triggering submenus in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @param {boolean} [props.inset] - Whether to apply inset styling.
 * @returns {JSX.Element} The rendered dropdown menu sub trigger component.
 * @author System
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

/**
 * DropdownMenuSubContent component for displaying submenu content in the dropdown menu.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional class names to apply.
 * @returns {JSX.Element} The rendered dropdown menu sub content component.
 * @author System
 */
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
