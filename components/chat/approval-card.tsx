"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Ban, Check, ChevronDown, Clock, FileText, Folder, MapPin, Pencil, TriangleExclamationPoint } from "lucide-react"

import { BrandIcon } from "@/components/brand/brand-icons"
import { LottiePlayer } from "@/components/lottie-player"
import type { Decision, PendingAction } from "@/lib/api/types"
import { formatProposedWhen, isAllDay } from "@/lib/format"
import { successCheck } from "@/lib/lottie/animations"
import { cn } from "@/lib/utils"

import { getToolMeta, type ToolField } from "./tool-meta"

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : null)
const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [])

function OpaqueId({ id, fallback }: { id: string | null; fallback: string }) {
  if (!id) return <span>{fallback}</span>
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span>Drive item</span>
      <code className="truncate rounded bg-muted px-1 py-px font-mono text-[11px] text-muted-foreground" title={id}>
        {id.length > 14 ? `${id.slice(0, 6)}…${id.slice(-5)}` : id}
      </code>
    </span>
  )
}

function Row({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
  return (
    <li className="flex min-w-0 items-start gap-2 text-[13px] text-muted-foreground">
      <Icon className="mt-[3px] size-3.5 shrink-0" />
      <span className="min-w-0 flex-1 text-foreground/85">{children}</span>
    </li>
  )
}

/** Friendly summary per tool, built from args (docs/API.md §8). */
function ActionDetails({ action }: { action: PendingAction }) {
  const a = action.args
  switch (action.tool) {
    case "create_calendar_event": {
      const attendees = list(a.attendees)
      return (
        <>
          <ul className="space-y-1.5">
            {str(a.start) && <Row icon={Clock}>{formatProposedWhen(String(a.start), str(a.end))}</Row>}
            {str(a.location) && <Row icon={MapPin}>{String(a.location)}</Row>}
            {str(a.description) && (
              <Row icon={FileText}>
                <span className="line-clamp-2">{String(a.description)}</span>
              </Row>
            )}
          </ul>
          {attendees.length > 0 && (
            <div className="mt-3 flex gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-[13px]">
              <TriangleExclamationPoint className="mt-0.5 size-3.5 shrink-0 text-warning" />
              <p>
                <span className="font-medium">Google will email an invite</span> to{" "}
                <span className="break-all">{attendees.join(", ")}</span>
              </p>
            </div>
          )}
        </>
      )
    }
    case "create_google_doc": {
      const content = str(a.content) ?? ""
      return (
        <div className="space-y-2">
          <ul>
            <Row icon={Folder}>
              <OpaqueId id={str(a.folder_id)} fallback="My Drive" />
            </Row>
          </ul>
          {content && (
            <details className="group rounded-lg border bg-surface">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground">
                Preview content
                <ChevronDown className="size-3.5 transition group-open:rotate-180" />
              </summary>
              <p className="scrollbar-thin max-h-40 overflow-y-auto px-3 pb-3 text-[13px] whitespace-pre-wrap">
                {content.length > 1200 ? `${content.slice(0, 1200)}…` : content}
              </p>
            </details>
          )}
        </div>
      )
    }
    case "create_drive_folder":
      return (
        <ul>
          <Row icon={Folder}>
            <OpaqueId id={str(a.parent_folder_id)} fallback="In My Drive" />
          </Row>
        </ul>
      )
    case "rename_drive_file":
      return (
        <ul>
          <Row icon={FileText}>
            <OpaqueId id={str(a.file_id)} fallback="File" />
          </Row>
        </ul>
      )
    case "move_drive_file":
      return (
        <ul className="space-y-1.5">
          <Row icon={FileText}>
            <OpaqueId id={str(a.file_id)} fallback="File" />
          </Row>
          <Row icon={Folder}>
            <span className="mr-1">into</span>
            <OpaqueId id={str(a.destination_folder_id)} fallback="folder" />
          </Row>
        </ul>
      )
    case "upload_file_to_drive":
      return (
        <ul className="space-y-1.5">
          <Row icon={FileText}>From the server&apos;s uploads folder</Row>
          <Row icon={Folder}>
            <OpaqueId id={str(a.folder_id)} fallback="To My Drive" />
          </Row>
        </ul>
      )
    default:
      return (
        <pre className="scrollbar-thin max-h-40 overflow-auto rounded-lg bg-muted p-2.5 font-mono text-[11px]">
          {JSON.stringify(a, null, 2)}
        </pre>
      )
  }
}

/* ---------- Edit form ---------- */

function initialValues(fields: ToolField[], args: Record<string, unknown>) {
  const values: Record<string, string> = {}
  for (const f of fields) {
    const v = args[f.key]
    values[f.key] = f.kind === "list" ? list(v).join(", ") : typeof v === "string" ? v : ""
  }
  return values
}

function buildArgs(fields: ToolField[], args: Record<string, unknown>, values: Record<string, string>) {
  // `edit` replaces args entirely, so start from the full original set.
  const next: Record<string, unknown> = { ...args }
  for (const f of fields) {
    if (f.kind === "id") continue
    const raw = values[f.key]?.trim() ?? ""
    if (f.kind === "list") {
      const items = raw.split(",").map((s) => s.trim()).filter(Boolean)
      next[f.key] = items.length ? items : null
    } else {
      next[f.key] = raw || (f.required ? "" : null)
    }
  }
  return next
}

function EditForm({
  action,
  onCancel,
  onSave,
}: {
  action: PendingAction
  onCancel: () => void
  onSave: (args: Record<string, unknown>) => void
}) {
  const meta = getToolMeta(action.tool)
  const fields = meta.fields.filter((f) => f.kind !== "id")
  const [values, setValues] = useState(() => initialValues(meta.fields, action.args))
  const allDay = typeof action.args.start === "string" && isAllDay(action.args.start)
  const valid = fields.every((f) => !f.required || values[f.key]?.trim())

  const inputCls =
    "w-full rounded-lg border bg-background px-2.5 py-1.5 text-[13px] outline-none transition focus:border-foreground/30 focus:ring-3 focus:ring-brand-soft"

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onSave(buildArgs(meta.fields, action.args, values))
      }}
      className="mt-3 space-y-2.5 border-t pt-3"
    >
      {fields.map((f) => {
        const id = `edit-${action.tool}-${f.key}`
        const common = {
          id,
          value: values[f.key] ?? "",
          placeholder: f.placeholder,
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setValues((v) => ({ ...v, [f.key]: e.target.value })),
          className: inputCls,
        }
        return (
          <div key={f.key} className="grid gap-1">
            <label htmlFor={id} className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {f.label}
              {f.required && <span className="text-brand"> *</span>}
            </label>
            {f.kind === "textarea" ? (
              <textarea rows={3} {...common} className={cn(inputCls, "resize-y")} />
            ) : f.kind === "when" ? (
              <input type={allDay ? "date" : "datetime-local"} {...common} />
            ) : (
              <input type="text" {...common} />
            )}
          </div>
        )
      })}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded-full px-3 py-1.5 text-xs font-medium hover:bg-muted">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!valid}
          className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-ink-foreground disabled:opacity-40"
        >
          Save &amp; approve
        </button>
      </div>
    </form>
  )
}

/* ---------- Card ---------- */

export type Draft = Decision | null

interface ApprovalCardProps {
  action: PendingAction
  draft: Draft
  resolved?: Decision
  expired?: boolean
  disabled: boolean
  onDraft: (decision: Decision | null) => void
}

export function ApprovalCard({ action, draft, resolved, expired, disabled, onDraft }: ApprovalCardProps) {
  const meta = getToolMeta(action.tool)
  const [mode, setMode] = useState<"idle" | "editing" | "rejecting">("idle")
  const [reason, setReason] = useState("")
  const done = resolved ?? (expired ? null : undefined)
  const final = resolved ?? draft
  const args = final?.type === "edit" ? final.args : action.args
  const shown = { ...action, args }

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-4 transition",
        done !== undefined ? "opacity-80" : "shadow-sm shadow-black/[0.03]"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl border bg-background">
          {meta.brand ? <BrandIcon brand={meta.brand} className="size-[18px]" /> : <meta.icon className="size-[18px]" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <meta.icon className="size-3" /> {meta.label}
          </p>
          <p className="mt-0.5 truncate text-[15px] font-semibold">{meta.title(args)}</p>
        </div>
        <Outcome decision={final} expired={expired} settled={!!resolved} />
      </div>

      <div className="mt-3">
        <ActionDetails action={shown} />
      </div>

      {done === undefined && !draft && (
        <AnimatePresence mode="wait" initial={false}>
          {mode === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onDraft({ type: "approve" })}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-ink-foreground transition hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
              >
                <Check className="size-3.5" strokeWidth={2.6} /> Approve
              </button>
              {meta.fields.some((f) => f.kind !== "id") && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setMode("editing")}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition hover:bg-muted disabled:opacity-40"
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
              )}
              <button
                type="button"
                disabled={disabled}
                onClick={() => setMode("rejecting")}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
              >
                <Ban className="size-3.5" /> Decline
              </button>
            </motion.div>
          )}

          {mode === "rejecting" && (
            <motion.form
              key="reject"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={(e) => {
                e.preventDefault()
                onDraft({ type: "reject", message: reason.trim() || null })
              }}
              className="mt-4 space-y-2"
            >
              <label htmlFor={`reason-${action.tool}`} className="sr-only">
                Reason for declining
              </label>
              <input
                id={`reason-${action.tool}`}
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell Lekan why — e.g. “make it 4pm instead”"
                className="w-full rounded-lg border bg-background px-3 py-2 text-[13px] outline-none focus:border-foreground/30 focus:ring-3 focus:ring-brand-soft"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setMode("idle")} className="rounded-full px-3 py-1.5 text-xs font-medium hover:bg-muted">
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-ink-foreground">
                  Decline
                </button>
              </div>
            </motion.form>
          )}

          {mode === "editing" && (
            <motion.div key="edit" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <EditForm
                action={action}
                onCancel={() => setMode("idle")}
                onSave={(edited) => onDraft({ type: "edit", args: edited })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {done === undefined && draft && (
        <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>
            {draft.type === "reject" && draft.message ? `Reason: “${draft.message}”` : "Decision saved"}
          </span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setMode("idle")
              onDraft(null)
            }}
            className="font-medium text-foreground underline-offset-2 hover:underline disabled:opacity-40"
          >
            Change
          </button>
        </div>
      )}

      {resolved?.type === "reject" && resolved.message && (
        <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">Reason: “{resolved.message}”</p>
      )}
    </div>
  )
}

function Outcome({ decision, expired, settled }: { decision: Draft | undefined; expired?: boolean; settled: boolean }) {
  if (expired) {
    return <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Expired</span>
  }
  if (!decision) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand">
        <span className="size-1.5 animate-pulse rounded-full bg-brand" /> Needs you
      </span>
    )
  }
  if (decision.type === "reject") {
    return <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Declined</span>
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 py-0.5 pr-2 pl-1 text-[11px] font-medium text-success">
      {settled ? (
        <LottiePlayer animationData={successCheck} loop={false} className="size-4" />
      ) : (
        <Check className="size-3" />
      )}
      {decision.type === "edit" ? "Edited" : "Approved"}
    </span>
  )
}
