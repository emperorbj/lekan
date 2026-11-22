"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

import { useChat } from "@/hooks/use-chat"

import { ChatLauncher } from "./chat-launcher"
import { ChatPanel } from "./chat-panel"

interface ChatContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  /** Open the chat and send a message straight away. */
  ask: (prompt: string) => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const chat = useChat()
  const { send } = chat

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])
  const ask = useCallback(
    (prompt: string) => {
      setIsOpen(true)
      send(prompt)
    },
    [send]
  )

  const value = useMemo(() => ({ isOpen, open, close, toggle, ask }), [isOpen, open, close, toggle, ask])

  return (
    <ChatContext.Provider value={value}>
      {children}
      <ChatPanel open={isOpen} onClose={close} chat={chat} />
      <ChatLauncher open={isOpen} onToggle={toggle} busy={chat.status !== "idle"} />
    </ChatContext.Provider>
  )
}

export function useChatWidget() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChatWidget must be used inside <ChatProvider>")
  return ctx
}
