"use client"

import type React from "react"
import { useState } from "react"
import "./globals.css"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // <CHANGE> Add sidebar state management for mobile responsiveness
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex h-screen bg-background">
          {/* <CHANGE> Pass sidebar state and handlers to components */}
          <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
            <DashboardHeader onMenuClick={toggleSidebar} />
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </Suspense>
      <Analytics />
    </ThemeProvider>
  )
}
