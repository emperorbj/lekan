"use client"

import { useCallback, useSyncExternalStore } from "react"
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query"

import { isApiError } from "@/lib/api/client"
import { mutationKeys } from "@/lib/api/query-keys"
import type { ChatResponse, Decision } from "@/lib/api/types"
import { chatStore, createId, findPendingApproval, type ChatMessage } from "@/lib/chat/store"
import { chatService } from "@/services/chat.service"

type NewMessage = ChatMessage extends infer M ? (M extends ChatMessage ? Omit<M, "id" | "at"> : never) : never

function push(message: NewMessage) {
  chatStore.update((s) => ({
    ...s,
    messages: [...s.messages, { ...message, id: createId(), at: Date.now() } as ChatMessage],
  }))
}

function patchMessage(id: string, patch: Partial<ChatMessage>) {
  chatStore.update((s) => ({
    ...s,
    messages: s.messages.map((m) => (m.id === id ? ({ ...m, ...patch } as ChatMessage) : m)),
  }))
}

function errorMessage(error: unknown) {
  return isApiError(error) ? error.message : "Something went wrong. Please try again."
}

/**
 * Chat state machine from docs/API.md §10:
 * IDLE → THINKING → (reply → IDLE) | (approvals → AWAITING_APPROVAL → THINKING …)
 */
export function useChat() {
  const queryClient = useQueryClient()
  const state = useSyncExternalStore(chatStore.subscribe, chatStore.getSnapshot, chatStore.getServerSnapshot)
  const isThinking = useIsMutating({ mutationKey: mutationKeys.chat }) > 0
  const pendingApproval = findPendingApproval(state.messages)

  const applyResponse = useCallback(
    (res: ChatResponse) => {
      chatStore.update((s) => ({ ...s, threadId: res.thread_id }))
      if (res.pending_approvals.length > 0) {
        push({ role: "approval", actions: res.pending_approvals })
      } else {
        push({ role: "assistant", content: res.reply ?? "" })
      }
    },
    []
  )

  // Callbacks live on the mutation options (not mutate()) so they still run if
  // the panel unmounts mid-request.
  const sendMutation = useMutation({
    mutationKey: [...mutationKeys.chat, "send"],
    mutationFn: (message: string) =>
      chatService.send({ message, thread_id: chatStore.getSnapshot().threadId }),
    onMutate: (message) => {
      push({ role: "user", content: message })
    },
    onSuccess: applyResponse,
    onError: (error, message) => {
      if (isApiError(error) && error.status === 409) {
        const pending = findPendingApproval(chatStore.getSnapshot().messages)
        push(
          pending
            ? { role: "notice", content: "Lekan is still waiting for your decision above." }
            : {
                role: "error",
                content:
                  "This conversation is waiting for an approval that isn't on this device. Start a new chat to continue.",
              }
        )
        return
      }
      push({ role: "error", content: errorMessage(error), retryMessage: message })
    },
  })

  const approveMutation = useMutation({
    mutationKey: [...mutationKeys.chat, "approve"],
    mutationFn: ({ decisions }: { messageId: string; decisions: Decision[] }) =>
      chatService.approve({ thread_id: chatStore.getSnapshot().threadId ?? "", decisions }),
    onMutate: ({ messageId, decisions }) => {
      patchMessage(messageId, { resolution: decisions })
    },
    onSuccess: (res) => {
      applyResponse(res)
      // Something in Calendar/Drive may have just changed.
      queryClient.invalidateQueries({ queryKey: ["google"] })
    },
    onError: (error, { messageId }) => {
      if (isApiError(error) && error.status === 400 && /nothing is waiting/i.test(error.message)) {
        patchMessage(messageId, { resolution: undefined, expired: true })
        push({
          role: "notice",
          content: "That request expired (the server may have restarted). Ask again to pick up where you left off.",
        })
        return
      }
      // Re-open the card so the user can resubmit.
      patchMessage(messageId, { resolution: undefined })
      push({ role: "error", content: errorMessage(error) })
    },
  })

  const send = useCallback(
    (raw: string) => {
      const message = raw.trim()
      if (!message || isThinking || findPendingApproval(chatStore.getSnapshot().messages)) return
      sendMutation.mutate(message)
    },
    [isThinking, sendMutation]
  )

  const retry = useCallback(
    (errorId: string) => {
      const { messages } = chatStore.getSnapshot()
      const index = messages.findIndex((m) => m.id === errorId)
      const target = messages[index]
      if (!target || target.role !== "error" || !target.retryMessage) return
      const prev = messages[index - 1]
      const dropIds = new Set([errorId])
      if (prev?.role === "user" && prev.content === target.retryMessage) dropIds.add(prev.id)
      chatStore.update((s) => ({ ...s, messages: s.messages.filter((m) => !dropIds.has(m.id)) }))
      sendMutation.mutate(target.retryMessage)
    },
    [sendMutation]
  )

  const decide = useCallback(
    (messageId: string, decisions: Decision[]) => {
      if (isThinking) return
      approveMutation.mutate({ messageId, decisions })
    },
    [approveMutation, isThinking]
  )

  const newChat = useCallback(() => {
    if (!isThinking) chatStore.reset()
  }, [isThinking])

  const status: "idle" | "thinking" | "awaiting_approval" = isThinking
    ? "thinking"
    : pendingApproval
      ? "awaiting_approval"
      : "idle"

  /** The message currently being worked on, used to pick a "thinking" phrase. */
  const lastUserMessage = [...state.messages].reverse().find((m) => m.role === "user")

  return {
    messages: state.messages,
    threadId: state.threadId,
    status,
    pendingApproval,
    lastUserMessage: lastUserMessage?.role === "user" ? lastUserMessage.content : null,
    send,
    retry,
    decide,
    newChat,
  }
}
