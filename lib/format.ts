/**
 * Date helpers. Approval args are local wall-clock times with no offset
 * ("2026-11-23T15:00" or "2026-11-23") and must be shown as-is (docs/API.md §12).
 */

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
const LOCAL_DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/

export function isAllDay(value: string) {
  return DATE_ONLY.test(value)
}

/** Parses "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM" as a *local* date (never UTC). */
export function parseLocal(value: string): Date | null {
  const d = DATE_ONLY.exec(value)
  if (d) return new Date(+d[1], +d[2] - 1, +d[3])
  const dt = LOCAL_DATETIME.exec(value)
  if (dt) return new Date(+dt[1], +dt[2] - 1, +dt[3], +dt[4], +dt[5])
  return null
}

const dayFmt = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short" })
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" })

export function formatDay(date: Date) {
  return dayFmt.format(date)
}

export function formatTime(date: Date) {
  return timeFmt.format(date)
}

/** "Mon 23 Nov · 15:00–15:30" for approval args (end is inclusive for all-day). */
export function formatProposedWhen(start: string, end?: string | null) {
  const s = parseLocal(start)
  if (!s) return start
  if (isAllDay(start)) {
    const e = end ? parseLocal(end) : null
    if (!e || e.getTime() === s.getTime()) return `${formatDay(s)} · All day`
    return `${formatDay(s)} – ${formatDay(e)} · All day`
  }
  const e = end ? parseLocal(end) : new Date(s.getTime() + 60 * 60 * 1000)
  if (!e) return `${formatDay(s)} · ${formatTime(s)}`
  const sameDay = e.toDateString() === s.toDateString()
  return sameDay
    ? `${formatDay(s)} · ${formatTime(s)}–${formatTime(e)}`
    : `${formatDay(s)} ${formatTime(s)} – ${formatDay(e)} ${formatTime(e)}`
}

/** For /google/events: timed values carry an offset; all-day `end` is exclusive. */
export function formatEventWhen(start: string, end: string) {
  if (isAllDay(start)) {
    const s = parseLocal(start)!
    const e = parseLocal(end)
    const lastDay = e ? new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1) : s
    return lastDay.getTime() <= s.getTime()
      ? { day: formatDay(s), time: "All day" }
      : { day: `${formatDay(s)} – ${formatDay(lastDay)}`, time: "All day" }
  }
  const s = new Date(start)
  const e = new Date(end)
  return { day: formatDay(s), time: `${formatTime(s)}–${formatTime(e)}` }
}
