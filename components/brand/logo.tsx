import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-7", className)}>
      <rect width="32" height="32" rx="9" className="fill-ink" />
      <path
        d="M11.5 9v11a2.5 2.5 0 0 0 2.5 2.5h7"
        className="stroke-ink-foreground"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="21.25" cy="11.25" r="2.75" className="fill-brand" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight">Lekan</span>
    </span>
  )
}
