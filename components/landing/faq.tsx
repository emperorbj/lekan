"use client"

import { Plus } from "lucide-react"

import { Container, Reveal, SectionHeading } from "./primitives"

const faqs = [
  {
    q: "What can Lekan do today?",
    a: "In Gmail it can search and read. In Calendar it can read your schedule and create events. In Drive it can search, create Google Docs and folders, rename and move files, and upload files from the server's uploads folder.",
  },
  {
    q: "Can it send emails or delete things?",
    a: "No. Gmail access is read-only, and nothing in Calendar or Drive can be deleted. Lekan also can't edit or remove existing calendar events.",
  },
  {
    q: "Why does it stop to ask me?",
    a: "Anything that changes your data (creating an event, a doc or a folder, renaming or moving a file) pauses for your approval. You see the exact details first, and you can approve, edit or decline.",
  },
  {
    q: "What happens if I decline?",
    a: "Lekan won't retry that action. If you tell it why (for example “make it 4pm instead”), it uses your reason to suggest what to do next.",
  },
  {
    q: "Where are my conversations stored?",
    a: "Your chat history is saved in your browser. The server keeps the active conversation in memory only, so restarting it starts fresh.",
  },
  {
    q: "How long does a reply take?",
    a: "Usually a few seconds. Requests that touch several apps can take up to a minute, and you'll see what Lekan is working on while you wait.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading eyebrow="FAQ" title="Questions, answered." description="Anything else? Ask Lekan itself. It's in the corner." />
        <Reveal>
          <ul className="divide-y border-y">
            {faqs.map((f) => (
              <li key={f.q}>
                <details className="group py-1 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[17px] font-medium transition hover:text-foreground/80">
                    {f.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border transition duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-ink-foreground">
                      <Plus className="size-4" />
                    </span>
                  </summary>
                  <p className="max-w-[60ch] pr-12 pb-6 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
