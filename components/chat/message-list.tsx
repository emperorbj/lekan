"use client"

import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import { CircleExclamationPoint, Info, RotateCcw } from "lucide-react"

import { LogoMark } from "@/components/brand/logo"
import type { useChat } from "@/hooks/use-chat"
import type { ChatMessage } from "@/lib/chat/store"

import { ApprovalGroup } from "./approval-group"
import { Markdown } from "./markdown"
import { ThinkingIndicator } from "./thinking-indicator"

type Chat = ReturnType<typeof useChat>

const enter = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
}

function AssistantRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <LogoMark className="mt-0.5 size-6 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function Message({ message, chat }: { message: ChatMessage; chat: Chat }) {
  switch (message.role) {
    case "user":
      return (
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap text-ink-foreground">
            {message.content}
          </p>
        </div>
      )
    case "assistant":
      return (
        <AssistantRow>
          {message.content.trim() ? (
            <Markdown>{message.content}</Markdown>
          ) : (
            <p className="text-[15px] text-muted-foreground italic">Done.</p>
          )}
        </AssistantRow>
      )
    case "approval":
      return (
        <AssistantRow>
          <ApprovalGroup
            message={message}
            disabled={chat.status === "thinking"}
            onDecide={(decisions) => chat.decide(message.id, decisions)}
          />
        </AssistantRow>
      )
    case "notice":
      return (
        <p className="mx-auto flex w-fit max-w-[90%] items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-center text-xs text-muted-foreground">
          <Info className="size-3.5 shrink-0" /> {message.content}
        </p>
      )
    case "error":
      return (
        <AssistantRow>
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-sm">
            <CircleExclamationPoint className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="flex-1">{message.content}</p>
            {message.retryMessage && (
              <button
                type="button"
                disabled={chat.status !== "idle"}
                onClick={() => chat.retry(message.id)}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-xs font-medium transition hover:bg-muted disabled:opacity-40"
              >
                <RotateCcw className="size-3" /> Retry
              </button>
            )}
          </div>
        </AssistantRow>
      )
  }
}

export function MessageList({ chat }: { chat: Chat }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [chat.messages.length, chat.status])

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
      <div className="space-y-5">
        {chat.messages.map((m) => (
          <motion.div key={m.id} {...enter}>
            <Message message={m} chat={chat} />
          </motion.div>
        ))}
        {chat.status === "thinking" && (
          <AssistantRow>
            <ThinkingIndicator prompt={chat.lastUserMessage} />
          </AssistantRow>
        )}
      </div>
      <div ref={endRef} className="h-px" />
    </div>
  )
}
