import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import ClientLayout from "@/components/client-layout"

export const metadata: Metadata = {
  title: "StoreAdmin - E-commerce Dashboard",
  description: "Professional e-commerce admin dashboard for managing your online store",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
