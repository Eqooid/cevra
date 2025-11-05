import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MainLayout from "@/components/main-layout";

/**
 * Geist Sans font configuration using next/font/google.
 * @constant {Object} geistSans - The Geist Sans font configuration.
 * @author Cristono Wijaya
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono font configuration using next/font/google.
 * @constant {Object} geistMono - The Geist Mono font configuration.
 * @author Cristono Wijaya
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata for the application, including title and description.
 * @author Cristono Wijaya
 */
export const metadata: Metadata = {
  title: "Cevra System",
  description: "",
};

/**
 * RootLayout component that wraps the entire application.
 * It includes the ThemeProvider for theming and MainLayout for consistent layout.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @return {JSX.Element} The rendered RootLayout component.
 * @author Cristono Wijaya
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MainLayout>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
