"use client"

import { SquarePen, X } from "lucide-react"

import { LogoMark } from "@/components/brand/logo"
import { useAuthStatus } from "@/hooks/use-auth-status"
import { useHealth } from "@/hooks/use-health"
import { cn } from "@/lib/utils"

interface ChatHeaderProps {
  onClose: () => void
  onNewChat: () => void
  canReset: boolean
}

function useStatusLine() {
  const health = useHealth()
  const auth = useAuthStatus({ enabled: health.isSuccess })

  if (health.isPending) return { tone: "idle", text: "Connecting…" } as const
  if (health.isError) return { tone: "error", text: "Server offline" } as const
  if (auth.isPending) return { tone: "idle", text: "Checking Google…" } as const
  if (auth.isConnected) return { tone: "ok", text: "Connected to Google" } as const
  return { tone: "warn", text: "Google not connected" } as const
}

export function ChatHeader({ onClose, onNewChat, canReset }: ChatHeaderProps) {
  const status = useStatusLine()

  return (
    <header className="flex items-center gap-3 border-b px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="relative">
        <LogoMark className="size-9" />
        <span
          aria-hidden
          className={cn(
            "absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background",
            status.tone === "ok" && "bg-success",
            status.tone === "warn" && "bg-warning",
            status.tone === "error" && "bg-destructive",
            status.tone === "idle" && "bg-muted-foreground/50"
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-tight font-semibold">Lekan</p>
        <p className="truncate text-xs text-muted-foreground" aria-live="polite">
          {status.text}
        </p>
      </div>
      <button
        type="button"
        onClick={onNewChat}
        disabled={!canReset}
        title="New chat"
        aria-label="Start a new chat"
        className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <SquarePen className="size-[18px]" />
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <X className="size-5" />
      </button>
    </header>
  )
}
