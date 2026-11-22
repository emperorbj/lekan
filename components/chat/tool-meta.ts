import type { LucideIcon } from "lucide-react"
import { CalendarPlus, FilePlus, FolderInput, FolderPlus, PenLine, Upload, WandSparkles } from "lucide-react"

import type { BrandKey } from "@/components/brand/brand-icons"

export type FieldKind = "text" | "textarea" | "when" | "list" | "id"

export interface ToolField {
  key: string
  label: string
  kind: FieldKind
  required?: boolean
  placeholder?: string
}

export interface ToolMeta {
  label: string
  brand: BrandKey | null
  icon: LucideIcon
  /** The headline of the card (event title, doc name…). */
  title: (args: Record<string, unknown>) => string
  fields: ToolField[]
}

const str = (v: unknown) => (typeof v === "string" ? v : "")

export const toolMeta: Record<string, ToolMeta> = {
  create_calendar_event: {
    label: "Create calendar event",
    brand: "calendar",
    icon: CalendarPlus,
    title: (a) => str(a.summary) || "Untitled event",
    fields: [
      { key: "summary", label: "Title", kind: "text", required: true },
      { key: "start", label: "Starts", kind: "when", required: true },
      { key: "end", label: "Ends", kind: "when" },
      { key: "location", label: "Location", kind: "text", placeholder: "Optional" },
      { key: "description", label: "Notes", kind: "textarea", placeholder: "Optional" },
      { key: "attendees", label: "Guests", kind: "list", placeholder: "Comma-separated emails" },
    ],
  },
  create_google_doc: {
    label: "Create Google Doc",
    brand: "docs",
    icon: FilePlus,
    title: (a) => str(a.title) || "Untitled document",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "content", label: "Content", kind: "textarea", required: true },
      { key: "folder_id", label: "Folder", kind: "id" },
    ],
  },
  create_drive_folder: {
    label: "Create Drive folder",
    brand: "drive",
    icon: FolderPlus,
    title: (a) => str(a.name) || "New folder",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "parent_folder_id", label: "Inside", kind: "id" },
    ],
  },
  rename_drive_file: {
    label: "Rename in Drive",
    brand: "drive",
    icon: PenLine,
    title: (a) => str(a.new_name) || "Rename file",
    fields: [
      { key: "new_name", label: "New name", kind: "text", required: true },
      { key: "file_id", label: "File", kind: "id", required: true },
    ],
  },
  move_drive_file: {
    label: "Move in Drive",
    brand: "drive",
    icon: FolderInput,
    title: () => "Move file to another folder",
    fields: [
      { key: "file_id", label: "File", kind: "id", required: true },
      { key: "destination_folder_id", label: "To folder", kind: "id", required: true },
    ],
  },
  upload_file_to_drive: {
    label: "Upload to Drive",
    brand: "drive",
    icon: Upload,
    title: (a) => str(a.filename) || "Upload file",
    fields: [
      { key: "filename", label: "File", kind: "text", required: true },
      { key: "folder_id", label: "Into", kind: "id" },
    ],
  },
}

export function getToolMeta(tool: string): ToolMeta {
  return (
    toolMeta[tool] ?? {
      label: tool.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
      brand: null,
      icon: WandSparkles,
      title: () => "Action needs your approval",
      fields: [],
    }
  )
}
