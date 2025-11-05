"use client"

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";

/**
 * SiteHeader component represents the header section of the site.
 * It includes a sidebar trigger, a separator, and a mode toggle button.
 * @return {JSX.Element} The rendered SiteHeader component.
 */
export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium"></h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="sm:flex">
            <div className="dark:text-foreground">
              <ModeToggle />
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}