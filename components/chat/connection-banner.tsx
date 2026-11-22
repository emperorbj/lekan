"use client"

import { AnimatePresence, motion } from "motion/react"
import { RefreshCw, Unplug } from "lucide-react"

import { BrandIcon } from "@/components/brand/brand-icons"
import { LottiePlayer } from "@/components/lottie-player"
import { useConnectGoogle } from "@/hooks/use-connect-google"
import { useHealth } from "@/hooks/use-health"
import { pulseRings } from "@/lib/lottie/animations"

export function ConnectionBanner() {
  const health = useHealth()
  const { connect, recheck, isWaiting, isChecking, auth } = useConnectGoogle()

  let content: React.ReactNode = null

  if (health.isError) {
    content = (
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
          <Unplug className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Can&apos;t reach Lekan&apos;s server</p>
          <p className="text-xs text-muted-foreground">Make sure the backend is running, then try again.</p>
        </div>
        <button
          type="button"
          onClick={() => health.refetch()}
          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
        >
          <RefreshCw className={health.isFetching ? "size-3.5 animate-spin" : "size-3.5"} />
          Retry
        </button>
      </div>
    )
  } else if (health.isSuccess && auth.isSuccess && auth.needsConnection) {
    const reconnect = auth.data.connected || /revoked|expired/i.test(auth.data.reason ?? "")
    content = isWaiting ? (
      <div className="flex items-center gap-3">
        <LottiePlayer animationData={pulseRings} className="size-10" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Waiting for Google…</p>
          <p className="text-xs text-muted-foreground">Finish signing in on the new tab, then come back here.</p>
        </div>
        <button
          type="button"
          onClick={() => recheck()}
          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
        >
          <RefreshCw className={isChecking ? "size-3.5 animate-spin" : "size-3.5"} />
          Check
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border bg-card">
          <BrandIcon brand="google" className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{reconnect ? "Reconnect Google" : "Connect your Google account"}</p>
          <p className="text-xs text-muted-foreground">
            {reconnect
              ? "Lekan needs a fresh sign-in to keep working."
              : "So Lekan can read Gmail, Calendar and Drive."}
          </p>
        </div>
        <button
          type="button"
          onClick={connect}
          className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-ink-foreground transition hover:opacity-90"
        >
          {reconnect ? "Reconnect" : "Connect"}
        </button>
      </div>
    )
  }

  return (
    <AnimatePresence initial={false}>
      {content && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden border-b bg-surface"
        >
          <div className="px-4 py-3">{content}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
