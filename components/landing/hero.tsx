"use client"

import { motion } from "motion/react"
import { ArrowRight, Check } from "lucide-react"

import { BrandIcon, type BrandKey } from "@/components/brand/brand-icons"
import { useChatWidget } from "@/components/chat/chat-provider"

import { HeroDemo } from "./hero-demo"
import { Container, easeOut } from "./primitives"

const headline: { text: string; accent?: boolean }[] = [
  { text: "The" },
  { text: "assistant" },
  { text: "that" },
  { text: "asks" },
  { text: "before", accent: true },
  { text: "it" },
  { text: "acts." },
]

const apps: BrandKey[] = ["gmail", "calendar", "drive", "docs"]

export function Hero() {
  const { open } = useChatWidget()

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
      {/* Backdrop: dot grid fading out + a single faint signal glow. */}
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-3xl"
      />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 rounded-full border bg-card/70 py-1 pr-3.5 pl-1 text-[13px] text-muted-foreground shadow-sm backdrop-blur"
          >
            <span className="flex -space-x-1.5">
              {apps.map((b) => (
                <span key={b} className="grid size-6 place-items-center rounded-full border bg-card">
                  <BrandIcon brand={b} className="size-3" />
                </span>
              ))}
            </span>
            Your Google workspace, with a second pair of hands
          </motion.div>

          <h1 className="mt-7 font-serif text-[clamp(3.1rem,7.4vw,5.9rem)] leading-[0.94] tracking-[-0.025em] text-balance">
            {headline.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: "0.35em", filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: easeOut, delay: 0.18 + i * 0.07 }}
                className={w.accent ? "inline-block pr-[0.06em] text-brand italic" : "inline-block"}
              >
                {w.text}
                {i < headline.length - 1 && " "}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.7 }}
            className="mt-6 max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl"
          >
            Lekan reads your inbox, plans around your calendar and keeps Drive in order, all in plain
            language. Anything that would change your data waits for your yes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.82 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={open}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pr-5 pl-6 text-[15px] font-medium text-ink-foreground shadow-lg shadow-black/10 transition hover:-translate-y-px hover:shadow-xl"
            >
              Talk to Lekan
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </button>
            <a
              href="#approvals"
              className="inline-flex h-12 items-center rounded-full border bg-card/60 px-5 text-[15px] font-medium transition hover:bg-muted"
            >
              See how approvals work
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {["Read-only Gmail", "No deletes, ever", "You approve every change"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-brand" strokeWidth={2.4} />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: easeOut, delay: 0.45 }}
        >
          <HeroDemo />
        </motion.div>
      </Container>
    </section>
  )
}
