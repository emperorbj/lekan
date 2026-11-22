"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { MessageCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface ChatLauncherProps {
  open: boolean
  onToggle: () => void
  busy: boolean
}

export function ChatLauncher({ open, onToggle, busy }: ChatLauncherProps) {
  const [showHint, setShowHint] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const show = window.setTimeout(() => setShowHint(true), 2600)
    const hide = window.setTimeout(() => setShowHint(false), 9000)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [])

  const hintVisible = showHint && !open && !dismissed

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-50 flex items-end gap-3 sm:right-6 sm:bottom-6",
        // On phones the open panel is full-screen and has its own close button.
        open && "max-sm:hidden"
      )}
    >
      <AnimatePresence>
        {hintVisible && (
          <motion.button
            type="button"
            onClick={() => {
              setDismissed(true)
              onToggle()
            }}
            initial={{ opacity: 0, x: 8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="mb-2 hidden rounded-2xl rounded-br-md border bg-card px-4 py-2.5 text-left text-sm shadow-lg shadow-black/5 sm:block"
          >
            <span className="font-medium">What&apos;s on today?</span>
            <span className="block text-xs text-muted-foreground">Ask Lekan about your day</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setDismissed(true)
          onToggle()
        }}
        aria-label={open ? "Close chat with Lekan" : "Chat with Lekan"}
        aria-expanded={open}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 26, delay: 0.4 }}
        className="relative grid size-14 place-items-center rounded-full bg-ink text-ink-foreground shadow-xl shadow-black/15 outline-none focus-visible:ring-4 focus-visible:ring-ring"
      >
        {/* Soft signal ring when idle and closed */}
        {!open && (
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-brand/25 [animation-duration:2.8s]" />
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {busy && !open && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-70" />
            <span className="relative size-4 rounded-full border-2 border-background bg-brand" />
          </span>
        )}
      </motion.button>
    </div>
  )
}
