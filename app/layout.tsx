import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "NYC FARE Reporter - Fight Illegal Rental Fees",
  description:
    "Report illegal broker fees, discriminatory practices, and rental scams in NYC. Join our mission to make housing fair for everyone.",
  keywords: ["NYC", "rental fees", "broker fees", "housing", "tenant rights", "illegal fees"],
  authors: [{ name: "NYC FARE Reporter Team" }],
  creator: "NYC FARE Reporter",
  publisher: "NYC FARE Reporter",
  openGraph: {
    title: "NYC FARE Reporter - Fight Illegal Rental Fees",
    description: "Report illegal broker fees, discriminatory practices, and rental scams in NYC.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYC FARE Reporter - Fight Illegal Rental Fees",
    description: "Report illegal broker fees, discriminatory practices, and rental scams in NYC.",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
