"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FileText, Folder, Lock, Search, TriangleExclamationPoint } from "lucide-react"

import { BrandIcon, type BrandKey } from "@/components/brand/brand-icons"
import { cn } from "@/lib/utils"

import { Container, easeOut, Reveal, SectionHeading } from "./primitives"

function useCycle(length: number, ms: number) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % length), ms)
    return () => window.clearInterval(id)
  }, [length, ms])
  return i
}

function Card({
  brand,
  app,
  title,
  body,
  badge,
  className,
  children,
  delay = 0,
}: {
  brand: BrandKey
  app: string
  title: string
  body: string
  badge?: React.ReactNode
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={cn("h-full", className)}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border bg-card transition duration-500 hover:shadow-[0_24px_60px_-28px_rgb(0_0_0/0.25)]">
        <div className="p-7 pb-0 sm:p-8 sm:pb-0">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <BrandIcon brand={brand} /> {app}
            </p>
            {badge}
          </div>
          <h3 className="mt-5 font-serif text-[2rem] leading-[1.05] tracking-[-0.01em]">{title}</h3>
          <p className="mt-2.5 max-w-[44ch] text-[15px] leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <div className="relative mt-7 flex-1 px-7 pb-7 sm:px-8 sm:pb-8">{children}</div>
      </article>
    </Reveal>
  )
}

function Pill({ icon: Icon, children }: { icon: typeof Lock; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      <Icon className="size-3" /> {children}
    </span>
  )
}

/* ---- Visuals ---- */

const emails = [
  { from: "Jane Okafor", subject: "Project notes for Thursday", time: "09:41" },
  { from: "Acme Billing", subject: "Invoice #2026-114 is ready", time: "Yesterday" },
  { from: "Tunde", subject: "Re: Lisbon offsite — dates?", time: "Mon" },
]

function InboxVisual() {
  const active = useCycle(emails.length, 2400)
  return (
    <div className="rounded-2xl border bg-background p-3">
      <div className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-[13px]">
        <Search className="size-3.5 text-muted-foreground" />
        <span className="font-mono text-[12px] text-muted-foreground">from:</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-mono text-[12px]"
          >
            {emails[active].from.split(" ")[0].toLowerCase()}
          </motion.span>
        </AnimatePresence>
      </div>
      <ul className="mt-2 space-y-1">
        {emails.map((e, i) => (
          <li
            key={e.subject}
            className={cn(
              "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors duration-500",
              i === active ? "bg-brand-soft" : "bg-transparent"
            )}
          >
            {i === active && (
              <motion.span layoutId="inbox-active" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand" />
            )}
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold">
              {e.from[0]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{e.from}</span>
              <span className="block truncate text-muted-foreground">{e.subject}</span>
            </span>
            <span className="text-[11px] text-muted-foreground">{e.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CalendarVisual() {
  const hours = ["09", "10", "11", "12", "13", "14", "15"]
  return (
    <div className="relative rounded-2xl border bg-background p-3">
      <div className="relative">
        {hours.map((h) => (
          <div key={h} className="flex h-8 items-start gap-2 border-t border-dashed first:border-t-0">
            <span className="-mt-2 w-6 font-mono text-[10px] text-muted-foreground">{h}</span>
          </div>
        ))}
        <div className="absolute inset-y-0 right-0 left-8">
          <div className="absolute top-[4px] h-[52px] w-[70%] rounded-lg border-l-2 border-[#4285F4] bg-[#4285F4]/10 px-2 py-1 text-[11px]">
            <p className="font-semibold">Standup</p>
            <p className="text-muted-foreground">09:00 – 10:30</p>
          </div>
          <div className="absolute top-[100px] h-[40px] w-[60%] rounded-lg border-l-2 border-[#34A853] bg-[#34A853]/10 px-2 py-1 text-[11px]">
            <p className="font-semibold">Lunch with Tunde</p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.4 }}
            className="absolute top-[166px] right-0 h-[54px] w-[78%] rounded-lg border-2 border-dashed border-brand/60 bg-brand-soft px-2 py-1 text-[11px]"
          >
            <p className="flex items-center justify-between font-semibold">
              Dentist
              <span className="inline-flex items-center gap-1 rounded-full bg-card px-1.5 text-[10px] font-medium text-brand">
                <span className="size-1 animate-pulse rounded-full bg-brand" /> Needs you
              </span>
            </p>
            <p className="text-muted-foreground">15:00 – 16:00 · proposed</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const renames = [
  { from: "IMG_2041 final FINAL.pdf", to: "Invoice — Acme — Nov 2026.pdf" },
  { from: "Untitled document (3)", to: "Lisbon offsite — agenda" },
]

function DriveVisual() {
  const i = useCycle(renames.length * 2, 2200)
  const pair = renames[Math.floor(i / 2)]
  const renamed = i % 2 === 1
  return (
    <div className="space-y-1.5 rounded-2xl border bg-background p-3 text-[13px]">
      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2">
        <Folder className="size-4 fill-[#1FA463]/20 text-[#1FA463]" />
        <span className="font-medium">Clients</span>
        <span className="ml-auto text-[11px] text-muted-foreground">12 files</span>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2">
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        <span className="h-5 min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${pair.from}-${renamed}`}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease: easeOut }}
              className={cn("block truncate", renamed ? "font-medium" : "text-muted-foreground")}
            >
              {renamed ? pair.to : pair.from}
            </motion.span>
          </AnimatePresence>
        </span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors",
            renamed ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          )}
        >
          {renamed ? "Renamed" : "Rename?"}
        </span>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2">
        <Folder className="size-4 fill-[#F4B400]/20 text-[#F4B400]" />
        <span className="font-medium">Q1 Planning</span>
        <span className="ml-auto rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand">New</span>
      </div>
    </div>
  )
}

function DocVisual() {
  const lines = [92, 100, 84, 96, 60]
  return (
    <div className="relative mx-auto max-w-sm rounded-2xl border bg-background p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <BrandIcon brand="docs" className="size-4" />
        <p className="text-[13px] font-semibold">Project notes — Jane</p>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">Drafted from “Project notes for Thursday”</p>
      <div className="mt-4 space-y-2.5">
        {lines.map((w, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.25 + i * 0.12 }}
            style={{ width: `${w}%`, transformOrigin: "left" }}
            className={cn("h-2 rounded-full", i === 0 ? "bg-foreground/25" : "bg-muted-foreground/15")}
          />
        ))}
      </div>
    </div>
  )
}

export function Capabilities() {
  return (
    <section id="capabilities" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <>
              One conversation. Three apps it <em className="text-brand">actually</em> understands.
            </>
          }
          description="Lekan works across Gmail, Calendar and Drive at once, so one sentence can do what used to take five tabs."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Card
            className="lg:col-span-7"
            brand="gmail"
            app="Gmail"
            title="Ask your inbox anything."
            body="Find the invoice from March, summarise a long thread, or pull out every date Jane mentioned. Lekan searches and reads, and never sends."
            badge={<Pill icon={Lock}>Read-only</Pill>}
          >
            <InboxVisual />
          </Card>
          <Card
            className="lg:col-span-5"
            delay={0.08}
            brand="calendar"
            app="Calendar"
            title="Plan around what's real."
            body="See what's next, find a free slot and draft events. Guest invites are flagged before anyone gets an email."
            badge={<Pill icon={TriangleExclamationPoint}>Invites flagged</Pill>}
          >
            <CalendarVisual />
          </Card>
          <Card
            className="lg:col-span-5"
            brand="drive"
            app="Drive"
            title="Keep Drive tidy."
            body="Create folders, rename and move files just by describing what you want. No deletes, ever."
          >
            <DriveVisual />
          </Card>
          <Card
            className="lg:col-span-7"
            delay={0.08}
            brand="docs"
            app="Docs"
            title="Draft a doc from a sentence."
            body="Turn an email thread or a quick note into a Google Doc, filed in the folder where it belongs."
          >
            <DocVisual />
          </Card>
        </div>
      </Container>
    </section>
  )
}
