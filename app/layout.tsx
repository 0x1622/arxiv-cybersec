import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Anta } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { SearchProvider } from "@/components/search-provider"
import { ApiStatusAlert } from "@/components/api-status-alert"

// Load Inter font for body text
const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' })

// Load Anta font for headings
const anta = Anta({ 
  weight: '400',
  subsets: ["latin"], 
  display: 'swap',
  variable: '--font-anta' 
})

export const metadata: Metadata = {
  title: "CyberSec Research - Cybersecurity Research Papers",
  description: "Browse and search the latest cybersecurity research papers from arXiv",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${anta.variable}`}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SearchProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <ApiStatusAlert />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'