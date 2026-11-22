"use client"

import { useState } from "react"
import { ShieldCheck } from "lucide-react"

import type { Decision } from "@/lib/api/types"
import type { ApprovalMessage } from "@/lib/chat/store"

import { ApprovalCard, type Draft } from "./approval-card"

interface ApprovalGroupProps {
  message: ApprovalMessage
  disabled: boolean
  onDecide: (decisions: Decision[]) => void
}

/**
 * One card per pending action. /chat/approve needs exactly one decision per
 * action, in order (docs/API.md §7.1): a single action submits as soon as it's
 * decided; several are collected and sent together.
 */
export function ApprovalGroup({ message, disabled, onDecide }: ApprovalGroupProps) {
  const { actions, resolution, expired } = message
  const [drafts, setDrafts] = useState<Draft[]>(() => actions.map(() => null))
  const single = actions.length === 1
  const open = !resolution && !expired
  const decidedCount = drafts.filter(Boolean).length

  function setDraft(index: number, decision: Decision | null) {
    if (single && decision) {
      onDecide([decision])
      return
    }
    setDrafts((prev) => prev.map((d, i) => (i === index ? decision : d)))
  }

  return (
    <div className="space-y-2.5">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <ShieldCheck className="size-3.5 text-brand" />
        {open
          ? single
            ? "Lekan wants to make a change. Nothing happens until you decide."
            : `Lekan wants to make ${actions.length} changes. Nothing happens until you decide.`
          : expired
            ? "This request expired."
            : "You reviewed this request."}
      </p>

      {actions.map((action, i) => (
        <ApprovalCard
          key={i}
          action={action}
          draft={single ? null : drafts[i]}
          resolved={resolution?.[i]}
          expired={expired}
          disabled={disabled}
          onDraft={(d) => setDraft(i, d)}
        />
      ))}

      {open && !single && (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-dashed px-3 py-2.5">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onDecide(drafts.map((d) => d ?? { type: "approve" }))}
            className="rounded-full px-3 py-1.5 text-xs font-medium transition hover:bg-muted disabled:opacity-40"
          >
            {decidedCount === 0 ? "Approve all" : "Approve the rest"}
          </button>
          <button
            type="button"
            disabled={disabled || decidedCount < actions.length}
            onClick={() => onDecide(drafts as Decision[])}
            className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-ink-foreground transition disabled:opacity-40"
          >
            Submit {decidedCount}/{actions.length}
          </button>
        </div>
      )}
    </div>
  )
}
