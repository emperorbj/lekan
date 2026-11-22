import type { IconType } from "react-icons"
import {
  SiGmail,
  SiGoogle,
  SiGooglecalendar,
  SiGoogledocs,
  SiGoogledrive,
  SiGooglesheets,
  SiGoogleslides,
} from "react-icons/si"

import { cn } from "@/lib/utils"

export type BrandKey = "gmail" | "calendar" | "drive" | "docs" | "sheets" | "slides" | "google"

export const brands: Record<BrandKey, { name: string; Icon: IconType; color: string }> = {
  gmail: { name: "Gmail", Icon: SiGmail, color: "#EA4335" },
  calendar: { name: "Google Calendar", Icon: SiGooglecalendar, color: "#4285F4" },
  drive: { name: "Google Drive", Icon: SiGoogledrive, color: "#1FA463" },
  docs: { name: "Google Docs", Icon: SiGoogledocs, color: "#4285F4" },
  sheets: { name: "Google Sheets", Icon: SiGooglesheets, color: "#34A853" },
  slides: { name: "Google Slides", Icon: SiGoogleslides, color: "#F4B400" },
  google: { name: "Google", Icon: SiGoogle, color: "#4285F4" },
}

interface BrandIconProps {
  brand: BrandKey
  className?: string
  /** Render in the brand's colour instead of currentColor. */
  colored?: boolean
}

export function BrandIcon({ brand, className, colored = true }: BrandIconProps) {
  const { Icon, color, name } = brands[brand]
  return (
    <Icon
      aria-label={name}
      role="img"
      className={cn("size-4 shrink-0", className)}
      style={colored ? { color } : undefined}
    />
  )
}

/** Picks a brand for a Google URL so links in replies get the right icon. */
export function brandForUrl(href: string): BrandKey | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  const host = url.hostname
  const path = url.pathname
  if (host === "mail.google.com") return "gmail"
  if (host === "calendar.google.com" || (host.endsWith("google.com") && path.startsWith("/calendar")))
    return "calendar"
  if (host === "docs.google.com") {
    if (path.startsWith("/spreadsheets")) return "sheets"
    if (path.startsWith("/presentation")) return "slides"
    return "docs"
  }
  if (host === "drive.google.com") return "drive"
  return null
}
