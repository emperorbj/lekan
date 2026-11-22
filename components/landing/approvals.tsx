"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Ban, Check, Clock, Pencil, RotateCcw, TriangleExclamationPoint, Users } from "lucide-react"

import { BrandIcon } from "@/components/brand/brand-icons"
import { LogoMark } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

import { Container, easeOut, Eyebrow, Reveal } from "./primitives"

type DemoState = "pending" | "editing" | "rejecting" | "approved" | "edited" | "rejected"

const points = [
  { icon: Check, title: "Approve", body: "One tap and it's done. Lekan confirms what changed, with a link." },
  { icon: Pencil, title: "Edit", body: "Fix the time or the title yourself, then approve the corrected version." },
  { icon: Ban, title: "Decline", body: "Say why in your own words. Lekan won't retry, and asks what you'd like instead." },
]

const replies: Partial<Record<DemoState, string>> = {
  approved: "Done. “Design review” is on your calendar for Thu 26 Nov, 14:00–15:00, and Ada and Tunde have their invites.",
  edited: "Done. I booked it for 16:00–17:00 instead and sent the invites.",
  rejected: "No problem, I won't book it. Want me to suggest another time on Friday instead?",
}

function ApprovalDemo() {
  const [state, setState] = useState<DemoState>("pending")
  const [time, setTime] = useState("16:00")
  const [reason, setReason] = useState("Friday works better")
  const settled = state === "approved" || state === "edited" || state === "rejected"
  const shownTime = state === "edited" ? `${time}–${String(Number(time.slice(0, 2)) + 1).padStart(2, "0")}:${time.slice(3)}` : "14:00–15:00"

  return (
    <div className="relative">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-[13px] text-white/60">
          <LogoMark className="size-6" />
          <span>Lekan wants to make a change. Nothing happens until you decide.</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[oklch(0.22_0.012_265)] p-4 text-white">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5">
              <BrandIcon brand="calendar" className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">Create calendar event</p>
              <p className="text-base font-semibold">Design review</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={settled ? state : "pending"}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium",
                  !settled && "bg-brand/20 text-[oklch(0.78_0.15_40)]",
                  (state === "approved" || state === "edited") && "bg-emerald-400/15 text-emerald-300",
                  state === "rejected" && "bg-white/10 text-white/60"
                )}
              >
                {state === "approved" ? "Approved" : state === "edited" ? "Edited" : state === "rejected" ? "Declined" : "Needs you"}
              </motion.span>
            </AnimatePresence>
          </div>

          <ul className="mt-4 space-y-2 text-[13px] text-white/80">
            <li className="flex items-center gap-2">
              <Clock className="size-3.5 text-white/40" />
              Thu 26 Nov ·{" "}
              <motion.span key={shownTime} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn(state === "edited" && "font-semibold text-white")}>
                {shownTime}
              </motion.span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="size-3.5 text-white/40" /> ada@studio.co, tunde@studio.co
            </li>
          </ul>
          <div className="mt-3 flex gap-2 rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-[12px] text-amber-100">
            <TriangleExclamationPoint className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
            Google will email an invite to 2 guests.
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {state === "pending" && (
              <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setState("approved")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[oklch(0.19_0.012_265)] transition hover:bg-white/90 active:scale-[0.97]"
                >
                  <Check className="size-3.5" strokeWidth={2.6} /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => setState("editing")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[13px] font-medium transition hover:bg-white/10"
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setState("rejecting")}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <Ban className="size-3.5" /> Decline
                </button>
              </motion.div>
            )}

            {state === "editing" && (
              <motion.form
                key="edit"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  setState("edited")
                }}
                className="mt-4 flex flex-wrap items-end gap-2 border-t border-white/10 pt-4"
              >
                <label className="grid gap-1 text-[11px] font-medium tracking-wider text-white/50 uppercase">
                  Start time
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value || "16:00")}
                    className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[13px] text-white normal-case outline-none [color-scheme:dark] focus:border-white/30"
                  />
                </label>
                <button type="submit" className="rounded-full bg-white px-3.5 py-2 text-xs font-medium text-[oklch(0.19_0.012_265)]">
                  Save &amp; approve
                </button>
                <button type="button" onClick={() => setState("pending")} className="rounded-full px-3 py-2 text-xs text-white/60 hover:bg-white/10">
                  Cancel
                </button>
              </motion.form>
            )}

            {state === "rejecting" && (
              <motion.form
                key="reject"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  setState("rejected")
                }}
                className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4"
              >
                <label htmlFor="demo-reason" className="sr-only">
                  Reason
                </label>
                <input
                  id="demo-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white outline-none focus:border-white/30"
                />
                <button type="submit" className="rounded-full bg-white px-3.5 py-2 text-xs font-medium text-[oklch(0.19_0.012_265)]">
                  Decline
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {settled && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="overflow-hidden"
            >
              <div className="flex gap-2.5 pt-4 text-[14px] leading-relaxed text-white/85">
                <LogoMark className="mt-0.5 size-6 shrink-0" />
                <p>
                  {state === "rejected" && reason && <span className="block text-[12px] text-white/45">You said: “{reason}”</span>}
                  {replies[state]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setState("pending")}
                className="mt-3 ml-8 inline-flex items-center gap-1.5 text-xs font-medium text-white/50 transition hover:text-white"
              >
                <RotateCcw className="size-3" /> Try another choice
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Approvals() {
  return (
    <section id="approvals" className="relative overflow-hidden bg-[oklch(0.17_0.01_265)] py-24 text-white sm:py-32 dark:border-y dark:border-white/5 dark:bg-[oklch(0.13_0.008_265)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_70%_at_75%_50%,black,transparent)]"
      />
      <div aria-hidden className="pointer-events-none absolute top-1/2 right-[-10%] h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-brand/15 blur-[120px]" />

      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow className="text-white/50">Human in the loop</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.0] tracking-[-0.015em] text-balance">
              Nothing changes until you <em className="text-[oklch(0.78_0.15_40)]">say so.</em>
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/60">
              Reading is instant. But before Lekan creates an event, drafts a doc or moves a file, it stops and shows
              you exactly what it&apos;s about to do. Try it.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-5">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={0.08 * i}>
                <li className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5">
                    <p.icon className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-[15px] text-white/55">{p.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <ApprovalDemo />
        </Reveal>
      </Container>
    </section>
  )
}
