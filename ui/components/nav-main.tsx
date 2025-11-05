"use client";

import {type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

/**
 * NavMainItem interface defines the structure of a navigation item
 * used in the NavMain component. Each item includes a title, URL, and an icon.
 * @author Cristono Wijaya
 */
export interface NavMainItem {
  title: string;
  url: string;
  icon: Icon;
}

/**
 * NavMain component renders the main navigation menu within a sidebar.
 * It takes an array of navigation items and displays them with their respective icons.
 * @param {Object} props - The component props.
 * @param {NavMainItem[]} props.items - An array of navigation items to be displayed.
 * @return {JSX.Element} The rendered NavMain component with navigation items.
 * @author Cristono Wijaya
 */
export function NavMain({
  items,
}: {
  items: NavMainItem[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}