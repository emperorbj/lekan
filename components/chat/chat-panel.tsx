"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"

import type { useChat } from "@/hooks/use-chat"

import { ChatComposer, type ChatComposerHandle } from "./chat-composer"
import { ChatHeader } from "./chat-header"
import { ConnectionBanner } from "./connection-banner"
import { EmptyState } from "./empty-state"
import { MessageList } from "./message-list"

interface ChatPanelProps {
  open: boolean
  onClose: () => void
  chat: ReturnType<typeof useChat>
}

export function ChatPanel({ open, onClose, chat }: ChatPanelProps) {
  const composerRef = useRef<ChatComposerHandle>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    const focus = window.setTimeout(() => composerRef.current?.focus(), 250)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.clearTimeout(focus)
    }
  }, [open, onClose])

  const isEmpty = chat.messages.length === 0 && chat.status === "idle"

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="dialog"
          aria-label="Chat with Lekan"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          style={{ transformOrigin: "bottom right" }}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[min(720px,calc(100svh-8rem))] sm:w-[420px] sm:rounded-3xl sm:border sm:shadow-2xl sm:shadow-black/15"
        >
          <ChatHeader onClose={onClose} onNewChat={chat.newChat} canReset={chat.messages.length > 0 && chat.status !== "thinking"} />
          <ConnectionBanner />

          {isEmpty ? (
            <EmptyState onPick={chat.send} />
          ) : (
            <MessageList chat={chat} />
          )}

          <ChatComposer ref={composerRef} status={chat.status} onSend={chat.send} />
        </motion.section>
      )}
    </AnimatePresence>
  )
}
