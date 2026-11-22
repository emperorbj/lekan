"use client"

import { useState } from "react"
import { ArrowUp } from "lucide-react"

import { BrandIcon, type BrandKey } from "@/components/brand/brand-icons"
import { useChatWidget } from "@/components/chat/chat-provider"

import { Container, Reveal } from "./primitives"

const prompts: { brand: BrandKey; text: string }[] = [
  { brand: "calendar", text: "What does my week look like?" },
  { brand: "gmail", text: "Any emails I need to reply to?" },
  { brand: "drive", text: "Find my latest invoice in Drive" },
]

export function FinalCta() {
  const { ask } = useChatWidget()
  const [value, setValue] = useState("")

  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border bg-surface px-6 py-16 text-center sm:px-12 sm:py-24">
            <div
              aria-hidden
              className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,black,transparent)]"
            />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

            <div className="relative">
              <h2 className="mx-auto max-w-[16ch] font-serif text-[clamp(2.5rem,6vw,4.6rem)] leading-[0.98] tracking-[-0.02em] text-balance">
                What should Lekan take <em className="text-brand">off your plate?</em>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
                Ask your first question now. You&apos;ll approve anything before it happens.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!value.trim()) return
                  ask(value)
                  setValue("")
                }}
                className="mx-auto mt-9 flex max-w-xl items-center gap-2 rounded-full border bg-card p-1.5 pl-5 shadow-[0_20px_50px_-24px_rgb(0_0_0/0.3)] transition focus-within:ring-4 focus-within:ring-brand-soft"
              >
                <label htmlFor="cta-prompt" className="sr-only">
                  Ask Lekan
                </label>
                <input
                  id="cta-prompt"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Ask about your inbox, calendar or Drive…"
                  className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  aria-label="Ask Lekan"
                  disabled={!value.trim()}
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-ink-foreground transition enabled:hover:opacity-90 disabled:opacity-40"
                >
                  <ArrowUp className="size-[18px]" strokeWidth={2.4} />
                </button>
              </form>

              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {prompts.map((p) => (
                  <li key={p.text}>
                    <button
                      type="button"
                      onClick={() => ask(p.text)}
                      className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3.5 py-1.5 text-[13px] transition hover:-translate-y-px hover:border-foreground/20"
                    >
                      <BrandIcon brand={p.brand} className="size-3.5" />
                      {p.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
