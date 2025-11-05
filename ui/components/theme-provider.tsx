"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider component wraps its children with Next.js theme provider.
 * It allows for theme management across the application.
 * @param {React.ComponentProps<typeof NextThemesProvider>} props - Props for the NextThemesProvider.
 * @return {JSX.Element} The wrapped children with theme provider.
 * @author Cristono Wijaya
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}