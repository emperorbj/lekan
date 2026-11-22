import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

import { Providers } from "./providers"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Lekan — the assistant that asks before it acts",
  description:
    "Lekan reads your Gmail, plans around your Google Calendar and keeps Drive in order. Anything that changes your data waits for your approval.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#121317" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", sans.variable, mono.variable, display.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
