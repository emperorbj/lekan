"use client"

import { Ban, HardDrive, MailOpen, MonitorSmartphone, ShieldCheck, TriangleExclamationPoint } from "lucide-react"

import { Container, Reveal, SectionHeading } from "./primitives"

const items = [
  {
    icon: MailOpen,
    title: "Read-only Gmail",
    body: "Lekan can search and read your mail. It has no way to send, archive or delete it.",
  },
  {
    icon: Ban,
    title: "No deletes, ever",
    body: "Nothing in Calendar or Drive can be deleted. The worst case is a change you approved.",
  },
  {
    icon: TriangleExclamationPoint,
    title: "Invites called out",
    body: "If an event will email guests, the approval card says so plainly before you confirm.",
  },
  {
    icon: HardDrive,
    title: "Runs on your machine",
    body: "The backend is yours to host, connected to one Google account: the owner's.",
  },
  {
    icon: MonitorSmartphone,
    title: "History stays local",
    body: "Your conversation history lives in your browser, not in someone else's analytics.",
  },
  {
    icon: ShieldCheck,
    title: "Safe rendering",
    body: "Replies that quote email are sanitised, so hostile HTML or links can't slip through.",
  },
]

export function Principles() {
  return (
    <section id="trust" className="border-t bg-surface/50 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Trust"
          title="Built to be trusted with your inbox."
          description="Lekan is deliberately limited. These aren't settings you have to find. They're how it works."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[28px] border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.title} className="bg-card">
              <Reveal delay={0.05 * i} y={10} className="h-full p-7 sm:p-8">
                <span className="grid size-10 place-items-center rounded-xl border bg-background">
                  <item.icon className="size-[18px] text-brand" />
                </span>
                <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
