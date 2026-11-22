"use client"

import { useState } from "react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { ArrowRight, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Logo } from "@/components/brand/logo"
import { useChatWidget } from "@/components/chat/chat-provider"
import { cn } from "@/lib/utils"

const links = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#approvals", label: "Approvals" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle colour theme"
      className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {/* Both icons rendered; CSS picks one so there's no hydration flash. */}
      <Sun className="size-[18px] dark:hidden" />
      <Moon className="hidden size-[18px] dark:block" />
    </button>
  )
}

export function SiteHeader() {
  const { open } = useChatWidget()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12))

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5"
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center gap-6 rounded-full border px-4 transition-all duration-300 sm:px-5",
          scrolled
            ? "border-border bg-background/75 shadow-lg shadow-black/[0.04] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <a href="#top" aria-label="Lekan home">
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={open}
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-ink pr-3 pl-4 text-sm font-medium text-ink-foreground transition hover:opacity-90"
          >
            Talk to Lekan
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
