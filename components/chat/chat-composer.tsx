"use client"

import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ChatComposerHandle {
  focus: () => void
}

interface ChatComposerProps {
  status: "idle" | "thinking" | "awaiting_approval"
  onSend: (message: string) => void
}

const placeholders = {
  idle: "Ask about your inbox, calendar or Drive…",
  thinking: "Lekan is working on it…",
  awaiting_approval: "Review the request above to continue",
}

export const ChatComposer = forwardRef<ChatComposerHandle, ChatComposerProps>(function ChatComposer(
  { status, onSend },
  ref
) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const disabled = status !== "idle"
  const canSend = !disabled && value.trim().length > 0

  useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus() }), [])

  function resize(el: HTMLTextAreaElement) {
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`
  }

  function submit() {
    if (!canSend) return
    onSend(value)
    setValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.focus()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="border-t bg-background px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border bg-card p-1.5 pl-3.5 transition focus-within:border-foreground/25 focus-within:ring-4 focus-within:ring-brand-soft",
          disabled && "opacity-70"
        )}
      >
        <label htmlFor="lekan-composer" className="sr-only">
          Message Lekan
        </label>
        <textarea
          id="lekan-composer"
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder={placeholders[status]}
          onChange={(e) => {
            setValue(e.target.value)
            resize(e.target)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              submit()
            }
          }}
          className="scrollbar-thin max-h-36 min-h-9 flex-1 resize-none bg-transparent py-2 text-[15px] leading-5 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-ink-foreground transition enabled:hover:opacity-90 enabled:active:scale-95 disabled:bg-muted disabled:text-muted-foreground"
        >
          <ArrowUp className="size-[18px]" strokeWidth={2.4} />
        </button>
      </div>
      <p className="mt-2 hidden px-1 text-[11px] text-muted-foreground sm:block">
        <kbd className="font-sans font-medium text-foreground/70">Enter</kbd> to send ·{" "}
        <kbd className="font-sans font-medium text-foreground/70">Shift + Enter</kbd> for a new line · Changes always need your approval
      </p>
    </form>
  )
})
