"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { LottiePlayer } from "@/components/lottie-player"
import { thinkingDots } from "@/lib/lottie/animations"

const phrases: { test: RegExp; lines: string[] }[] = [
  {
    test: /\b(mail|email|inbox|gmail|thread|sender|unread|reply|newsletter)/i,
    lines: ["Searching your inbox", "Reading the thread", "Pulling out what matters"],
  },
  {
    test: /\b(calendar|meeting|event|schedule|tomorrow|today|week|free|book|slot|appointment)/i,
    lines: ["Checking your calendar", "Looking at what's coming up", "Working around your schedule"],
  },
  {
    test: /\b(drive|file|folder|doc|document|rename|move|upload|sheet)/i,
    lines: ["Looking through Drive", "Finding the right files", "Getting things in order"],
  },
]

const fallback = ["Thinking", "Working through your request", "Putting it together"]

export function ThinkingIndicator({ prompt }: { prompt: string | null }) {
  const lines = phrases.find((p) => prompt && p.test.test(prompt))?.lines ?? fallback
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2800)
    return () => window.clearInterval(id)
  }, [])

  // After ~12s, reassure: requests can take up to a minute (docs/API.md §6.1).
  const line = tick >= 4 ? "Still on it — bigger requests can take up to a minute" : lines[tick % lines.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <LottiePlayer animationData={thinkingDots} className="h-6 w-14" />
      <AnimatePresence mode="wait">
        <motion.span
          key={line}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22 }}
          className="text-shimmer text-sm"
        >
          {line}…
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}
