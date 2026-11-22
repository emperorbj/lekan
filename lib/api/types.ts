// Types mirror docs/API.md §11.

export type ApiErrorBody =
  | { detail: string }
  | { detail: { type: string; loc: (string | number)[]; msg: string; input?: unknown }[] }

export interface HealthResponse {
  status: "ok"
  google_configured: boolean
}

export type AuthStatus =
  | {
      connected: boolean
      scopes: string[]
      missing_scopes: string[]
      needs_reconnect: boolean
      has_refresh_token: boolean
      reason?: undefined
    }
  | { connected: false; reason: string; scopes?: undefined }

export interface ChatRequest {
  message: string
  thread_id?: string | null
}

export type ApprovalToolName =
  | "create_calendar_event"
  | "create_google_doc"
  | "create_drive_folder"
  | "rename_drive_file"
  | "move_drive_file"
  | "upload_file_to_drive"

export interface PendingAction {
  tool: ApprovalToolName | (string & {})
  args: Record<string, unknown>
  description: string
}

export interface ChatResponse {
  thread_id: string
  reply: string | null
  pending_approvals: PendingAction[]
}

export type Decision =
  | { type: "approve" }
  | { type: "reject"; message?: string | null }
  | { type: "edit"; args: Record<string, unknown> }

export interface ApprovalRequest {
  thread_id: string
  decisions: Decision[]
}

export interface Email {
  id: string
  from: string | null
  subject: string | null
  date: string | null
  snippet: string | null
}

export interface CalendarEvent {
  id: string
  summary: string
  start: string
  end: string
  location: string | null
  attendees: string[]
  link: string | null
}

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  modifiedTime: string
  webViewLink?: string
  parents?: string[]
}
