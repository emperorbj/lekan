"use client"

import { motion } from "motion/react"
import { ArrowUp, Check } from "lucide-react"

import { BrandIcon } from "@/components/brand/brand-icons"

import { Container, easeOut, Reveal, SectionHeading } from "./primitives"

const steps = [
  {
    n: "01",
    title: "Connect Google",
    body: "One sign-in with Google. Lekan works for a single owner, and that's you.",
    visual: (
      <span className="inline-flex items-center gap-2.5 rounded-full border bg-background px-4 py-2 text-[13px] font-medium shadow-sm">
        <BrandIcon brand="google" className="size-4" /> Continue with Google
      </span>
    ),
  },
  {
    n: "02",
    title: "Ask in plain language",
    body: "Type like you'd message a colleague. Lekan searches, reads and cross-references for you.",
    visual: (
      <span className="inline-flex items-center gap-2 rounded-2xl border bg-background py-1.5 pr-1.5 pl-3.5 text-[13px] shadow-sm">
        Am I free Thursday afternoon?
        <span className="grid size-7 place-items-center rounded-lg bg-ink text-ink-foreground">
          <ArrowUp className="size-3.5" strokeWidth={2.4} />
        </span>
      </span>
    ),
  },
  {
    n: "03",
    title: "Approve and move on",
    body: "Review a clear card for each change. Approve, tweak or decline, and you're done.",
    visual: (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-ink-foreground shadow-sm">
        <Check className="size-3.5" strokeWidth={2.6} /> Approve
      </span>
    ),
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Up and running in about a minute."
          description="No setup screens and no prompt engineering. Connect once, then just ask."
        />

        <div className="relative mt-16">
          {/* Connector line draws across on scroll (desktop) */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.4, ease: easeOut }}
            style={{ transformOrigin: "left" }}
            className="absolute top-[22px] right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-border via-brand/50 to-border md:block"
          />
          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={0.12 * i}>
                <li className="flex flex-col items-start md:items-center md:text-center">
                  <span className="relative grid size-11 place-items-center rounded-full border bg-background font-mono text-xs font-medium shadow-sm">
                    {s.n}
                  </span>
                  <h3 className="mt-6 font-serif text-[1.75rem] leading-tight">{s.title}</h3>
                  <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
                  <div className="mt-6 flex h-24 w-full items-center justify-start rounded-2xl border bg-surface/60 px-5 md:justify-center">
                    {s.visual}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
