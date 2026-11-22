"use client"

import { BrandIcon, brands, type BrandKey } from "@/components/brand/brand-icons"

import { Container, Reveal } from "./primitives"

const items: { brand: BrandKey; does: string }[] = [
  { brand: "gmail", does: "Read & search" },
  { brand: "calendar", does: "Read & create" },
  { brand: "drive", does: "Search & organise" },
  { brand: "docs", does: "Draft new docs" },
]

export function Integrations() {
  return (
    <section aria-label="Works with" className="border-y bg-surface/60 py-10">
      <Container>
        <Reveal className="flex flex-col items-center gap-7 md:flex-row md:justify-between">
          <p className="max-w-[22ch] text-center text-sm text-muted-foreground md:text-left">
            Lives inside the Google tools you already use every day.
          </p>
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 md:w-auto md:gap-8">
            {items.map(({ brand, does }) => (
              <li key={brand} className="group flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl border bg-card shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <BrandIcon brand={brand} className="size-[18px]" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-medium">{brands[brand].name.replace("Google ", "")}</span>
                  <span className="block text-xs text-muted-foreground">{does}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
