"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react"
import { ArrowUp, ArrowUpRight, Check, Clock, LoaderCircle, ShieldCheck } from "lucide-react"

import { BrandIcon, type BrandKey } from "@/components/brand/brand-icons"
import { LogoMark } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

import { easeOut } from "./primitives"

const PROMPT = "Book the dentist for Monday at 3pm, and turn Jane's project notes into a doc."

/** Timeline of the scripted conversation, in ms from loop start. */
const STEPS = {
  typing: 300,
  sent: 2900,
  trace1: 3300,
  trace1Done: 4500,
  trace2Done: 5500,
  approvals: 6000,
  press: 8000,
  approved: 8350,
  thinking: 8900,
  reply: 10100,
  end: 15000,
} as const

type Step = keyof typeof STEPS
const order = Object.keys(STEPS) as Step[]

function useScript(active: boolean) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState<Step | "idle">("idle")
  const [loop, setLoop] = useState(0)

  useEffect(() => {
    if (!active || reduce) return
    const timers = order.map((s) =>
      window.setTimeout(() => {
        if (s === "end") {
          setStep("idle")
          setLoop((l) => l + 1)
        } else setStep(s)
      }, STEPS[s])
    )
    return () => timers.forEach(clearTimeout)
  }, [active, loop, reduce])

  const current = reduce ? "reply" : step
  const reached = (s: Step) => current !== "idle" && order.indexOf(current) >= order.indexOf(s)
  return { step: current, reached }
}

function useTyping(text: string, running: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!running) return
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) window.clearInterval(id)
    }, 30)
    return () => {
      window.clearInterval(id)
      setCount(0)
    }
  }, [running, text])
  return text.slice(0, count)
}

function Trace({ brand, label, detail, done }: { brand: BrandKey; label: string; detail: string; done: boolean }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="flex items-center gap-2 text-[13px]"
    >
      <span className="grid size-5 place-items-center">
        {done ? (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="grid size-4 place-items-center rounded-full bg-success/15">
            <Check className="size-2.5 text-success" strokeWidth={3} />
          </motion.span>
        ) : (
          <LoaderCircle className="size-3.5 animate-spin text-muted-foreground" />
        )}
      </span>
      <BrandIcon brand={brand} className="size-3.5" />
      <span className={cn("font-medium", !done && "text-shimmer")}>{label}</span>
      <span className="truncate text-muted-foreground">{detail}</span>
    </motion.li>
  )
}

function MiniApproval({
  brand,
  kind,
  title,
  meta,
  approved,
}: {
  brand: BrandKey
  kind: string
  title: string
  meta: string
  approved: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background px-3 py-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-card">
        <BrandIcon brand={brand} className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">{kind}</p>
        <p className="truncate text-[13px] font-semibold">{title}</p>
        <p className="flex items-center gap-1 truncate text-[12px] text-muted-foreground">
          <Clock className="size-3" /> {meta}
        </p>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {approved ? (
          <motion.span
            key="ok"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success"
          >
            <Check className="size-3" strokeWidth={3} /> Approved
          </motion.span>
        ) : (
          <motion.span
            key="wait"
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-brand" /> Needs you
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export function HeroDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const { step, reached } = useScript(inView)
  const typed = useTyping(PROMPT, step === "typing")

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[520px]">
      {/* Floating proof chip */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -left-4 z-10 hidden items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium shadow-lg shadow-black/5 sm:flex"
      >
        <ShieldCheck className="size-3.5 text-brand" /> Nothing changes without you
      </motion.div>

      <div className="overflow-hidden rounded-[28px] border bg-card shadow-[0_40px_100px_-30px_rgb(0_0_0/0.28)] dark:shadow-[0_40px_100px_-30px_rgb(0_0_0/0.7)]">
        {/* Window header */}
        <div className="flex items-center gap-2.5 border-b px-4 py-3">
          <LogoMark className="size-7" />
          <div className="flex-1">
            <p className="text-[13px] leading-tight font-semibold">Lekan</p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" /> Connected to Google
            </p>
          </div>
          <div className="flex -space-x-1">
            {(["gmail", "calendar", "drive"] as const).map((b) => (
              <span key={b} className="grid size-6 place-items-center rounded-full border bg-background">
                <BrandIcon brand={b} className="size-3" />
              </span>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex h-[440px] flex-col gap-4 overflow-hidden bg-surface/40 px-4 py-5 sm:h-[460px]">
          <AnimatePresence>
            {reached("sent") && (
              <motion.p
                key="user"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: easeOut }}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[14px] leading-snug text-ink-foreground"
              >
                {PROMPT}
              </motion.p>
            )}

            {reached("trace1") && (
              <motion.div key="lekan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2.5">
                <LogoMark className="mt-0.5 size-6" />
                <div className="min-w-0 flex-1 space-y-3">
                  <ul className="space-y-1.5">
                    <Trace brand="gmail" label="Searched Gmail" detail="from:jane “project notes”" done={reached("trace1Done")} />
                    {reached("trace1Done") && (
                      <Trace brand="calendar" label="Checked Calendar" detail="Mon 23 Nov is free at 15:00" done={reached("trace2Done")} />
                    )}
                  </ul>

                  {reached("approvals") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: easeOut }}
                      className="space-y-2 rounded-2xl border bg-card p-3"
                    >
                      <p className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
                        <ShieldCheck className="size-3.5 text-brand" /> 2 changes waiting for you
                      </p>
                      <MiniApproval brand="calendar" kind="Create event" title="Dentist" meta="Mon 23 Nov · 15:00–16:00" approved={reached("approved")} />
                      <MiniApproval brand="docs" kind="Create doc" title="Project notes — Jane" meta="From Jane’s email, 1,240 words" approved={reached("approved")} />
                      <div className="flex justify-end gap-2 pt-1">
                        <span className="rounded-full px-3 py-1.5 text-[12px] font-medium text-muted-foreground">Review</span>
                        <motion.span
                          animate={
                            step === "press"
                              ? { scale: [1, 0.94, 1] }
                              : reached("approved")
                                ? { opacity: 0.5 }
                                : { scale: 1 }
                          }
                          transition={{ duration: 0.35 }}
                          className="inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-ink-foreground"
                        >
                          <Check className="size-3" strokeWidth={3} /> Approve both
                        </motion.span>
                      </div>
                    </motion.div>
                  )}

                  {step === "thinking" && (
                    <div className="flex items-center gap-1 pl-1" aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="size-1.5 rounded-full bg-brand"
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  )}

                  {reached("reply") && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: easeOut }}
                      className="text-[14px] leading-relaxed"
                    >
                      All set. <strong className="font-semibold">Dentist</strong> is on your calendar for Monday at 15:00,
                      and the notes are in Drive:
                      <span className="mt-2 flex flex-wrap gap-1.5">
                        {[
                          { brand: "calendar" as const, label: "Dentist" },
                          { brand: "docs" as const, label: "Project notes — Jane" },
                        ].map((c) => (
                          <span key={c.label} className="inline-flex items-center gap-1.5 rounded-md border bg-card px-1.5 py-0.5 text-[12px] font-medium">
                            <BrandIcon brand={c.brand} className="size-3" />
                            {c.label}
                            <ArrowUpRight className="size-3 text-muted-foreground" />
                          </span>
                        ))}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Composer */}
        <div className="border-t p-3">
          <div className="flex items-center gap-2 rounded-2xl border bg-background py-1.5 pr-1.5 pl-3.5">
            <p className="min-h-5 flex-1 truncate text-[13px]">
              {step === "typing" ? (
                <>
                  {typed}
                  <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-blink bg-foreground" />
                </>
              ) : (
                <span className="text-muted-foreground">Ask about your inbox, calendar or Drive…</span>
              )}
            </p>
            <span
              className={cn(
                "grid size-8 place-items-center rounded-xl transition-colors",
                step === "typing" ? "bg-ink text-ink-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUp className="size-4" strokeWidth={2.4} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
