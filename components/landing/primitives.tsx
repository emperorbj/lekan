"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export const easeOut = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  delay = 0,
  className,
  y = 18,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: easeOut, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-brand" aria-hidden />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  className?: string
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-serif text-[clamp(2.25rem,4.6vw,3.6rem)] leading-[1.02] tracking-[-0.015em] text-balance">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-lg text-pretty text-muted-foreground", align === "center" && "mx-auto max-w-xl")}>
          {description}
        </p>
      )}
    </Reveal>
  )
}
