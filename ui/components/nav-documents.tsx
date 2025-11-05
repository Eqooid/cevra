"use client";

import { type Icon } from "@tabler/icons-react"
import {
  SidebarGroup, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

/**
 * NavDocumentsItem interface represents a single document navigation item.
 * It includes the title, URL, and icon for the document.
 * @author Cristono Wijaya
 */
export interface NavDocumentsItem {
  title: string;
  url: string;
  icon: Icon;
};

/**
 * NavDocuments component renders the documents navigation menu within a sidebar.
 * It takes an array of document items and displays them with their respective icons.
 * @param {Object} props - The component props.
 * @param {NavDocumentsItem[]} props.items - An array of document items to be displayed.
 * @return {JSX.Element} The rendered NavDocuments component with document items.
 * @author Cristono Wijaya
 */
export function NavDocuments({
  items,
}: {
  items: NavDocumentsItem[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <Link href={item.url} key={item.title} passHref>
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}