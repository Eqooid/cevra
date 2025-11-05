import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

/**
 * Styles for the sidebar provider, defining the sidebar width and header height.
 * These styles are used to configure the layout of the sidebar and header.
 * @author Cristono Wijaya
 */
export const sidebarProviderStyle = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)"
};

/**
 * MainLayout component serves as the primary layout for the application.
 * It includes the sidebar and header, and renders the main content passed as children.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The main content to be displayed within the layout.
 * @return {JSX.Element} The rendered MainLayout component with sidebar and header.
 * @author Cristono Wijaya
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider style={sidebarProviderStyle as React.CSSProperties}>
      <AppSidebar variant="inset"/>
      <SidebarInset>
        <SiteHeader/>        
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}