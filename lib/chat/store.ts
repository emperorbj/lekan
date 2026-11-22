import type { Decision, PendingAction } from "@/lib/api/types"

/**
 * The backend keeps no message history (docs/API.md §6.2), so the transcript
 * lives here and is persisted to localStorage. It's an external store so that
 * an in-flight request can still land after the chat panel is closed.
 */

type Base = { id: string; at: number }

export type ChatMessage =
  | (Base & { role: "user"; content: string })
  | (Base & { role: "assistant"; content: string })
  | (Base & { role: "notice"; content: string })
  | (Base & { role: "error"; content: string; retryMessage?: string })
  | (Base & {
      role: "approval"
      actions: PendingAction[]
      /** Set once the user submits; one decision per action, in order. */
      resolution?: Decision[]
      /** The server no longer had this approval (e.g. it restarted). */
      expired?: boolean
    })

export type ApprovalMessage = Extract<ChatMessage, { role: "approval" }>

export interface ChatState {
  threadId: string | null
  messages: ChatMessage[]
}

const STORAGE_KEY = "lekan.chat.v1"
const EMPTY: ChatState = { threadId: null, messages: [] }

let state: ChatState = EMPTY
let hydrated = false
const listeners = new Set<() => void>()

function hydrate() {
  if (hydrated || typeof window === "undefined") return
  hydrated = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Partial<ChatState>
    if (Array.isArray(parsed.messages)) {
      state = { threadId: parsed.threadId ?? null, messages: parsed.messages }
    }
  } catch {
    // Storage unavailable or corrupted: start fresh.
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode / quota: the chat still works for this session.
  }
}

export const chatStore = {
  subscribe(listener: () => void) {
    hydrate()
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot(): ChatState {
    hydrate()
    return state
  },
  getServerSnapshot(): ChatState {
    return EMPTY
  },
  update(updater: (prev: ChatState) => ChatState) {
    hydrate()
    state = updater(state)
    persist()
    listeners.forEach((l) => l())
  },
  reset() {
    chatStore.update(() => EMPTY)
  },
}

export function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function findPendingApproval(messages: ChatMessage[]): ApprovalMessage | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role === "approval") return m.resolution || m.expired ? null : m
  }
  return null
}
