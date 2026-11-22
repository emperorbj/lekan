"use client"

import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"

import { BrandIcon, type BrandKey } from "@/components/brand/brand-icons"
import { LottiePlayer } from "@/components/lottie-player"
import { useAuthStatus } from "@/hooks/use-auth-status"
import { useUpcomingEvents } from "@/hooks/use-google-data"
import { formatEventWhen } from "@/lib/format"
import { pulseRings } from "@/lib/lottie/animations"

const suggestions: { brand: BrandKey; text: string }[] = [
  { brand: "calendar", text: "What's on my calendar tomorrow?" },
  { brand: "gmail", text: "Summarise the emails I got this week" },
  { brand: "docs", text: "Turn my latest email into a Google Doc" },
  { brand: "drive", text: "Create a Drive folder called Q1 Planning" },
]

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  const auth = useAuthStatus()
  const events = useUpcomingEvents(auth.isConnected)

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto overscroll-contain px-5 py-6">
      <div className="flex flex-col items-center text-center">
        <LottiePlayer animationData={pulseRings} className="size-20" />
        <h2 className="mt-3 font-serif text-3xl tracking-tight">Hi, I&apos;m Lekan.</h2>
        <p className="mt-1.5 max-w-[30ch] text-sm text-muted-foreground">
          Ask me anything about your inbox, calendar or Drive. I&apos;ll check with you before I change a thing.
        </p>
      </div>

      <ul className="mt-6 grid gap-2">
        {suggestions.map((s, i) => (
          <motion.li
            key={s.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => onPick(s.text)}
              className="group flex w-full items-center gap-3 rounded-xl border bg-card px-3.5 py-3 text-left text-sm transition hover:-translate-y-px hover:border-foreground/20 hover:shadow-sm"
            >
              <BrandIcon brand={s.brand} />
              <span className="flex-1">{s.text}</span>
              <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </button>
          </motion.li>
        ))}
      </ul>

      {auth.isConnected && events.data && events.data.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
          aria-label="Up next on your calendar"
        >
          <h3 className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <BrandIcon brand="calendar" className="size-3.5" /> Up next
          </h3>
          <ul className="divide-y rounded-xl border bg-card">
            {events.data.slice(0, 3).map((e) => {
              const when = formatEventWhen(e.start, e.end)
              return (
                <li key={e.id}>
                  <a
                    href={e.link ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3.5 py-2.5 text-sm transition hover:bg-muted/60"
                  >
                    <span className="h-8 w-1 rounded-full bg-brand/70" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{e.summary}</span>
                      <span className="block text-xs text-muted-foreground">
                        {when.day} · {when.time}
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </motion.section>
      )}
    </div>
  )
}
