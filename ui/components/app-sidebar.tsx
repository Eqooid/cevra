"use client";

import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconMessage,
  IconClockRecord,
} from "@tabler/icons-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, 
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain, NavMainItem } from "./nav-main";
import { NavDocuments, NavDocumentsItem } from "./nav-documents";
import Image from "next/image";

/**
 * AppSidebar component represents the application's sidebar.
 * It includes navigation menus for main items and documents.
 * @return {NavMainItem[]} The rendered AppSidebar component.
 * @author Cristono Wijaya
 */
const navMainData: NavMainItem[] = [
  { title: "Dashboard", url: "/", icon: IconDashboard }
];

/**
 * Data for the documents navigation menu in the sidebar.
 * Each item includes a title, URL, and icon.
 * @return {NavDocumentsItem[]} The array of document navigation items.
 * @author Cristono Wijaya
 */
const NavDocumentsData: NavDocumentsItem[] = [
  { title: "Storage", url: "/storage", icon: IconDatabase },
  { title: "Chat", url: "/chat", icon: IconMessage },
  { title: "Logs", url: "/logs", icon: IconClockRecord }
];

/**
 * AppSidebar component renders the sidebar with navigation menus.
 * It uses the Sidebar component and includes main navigation and documents sections.
 * @param {Object} props - The component props.
 * @return {JSX.Element} The rendered AppSidebar component.
 * @author Cristono Wijaya
 */
export function AppSidebar({...props} : React.ComponentProps<typeof Sidebar>) { 
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <Image src="/logo.png" alt="Cevra System Logo" width={23} height={23} />
                <span className="text-base font-semibold">Cevra System</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
        <NavDocuments items={NavDocumentsData} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}
