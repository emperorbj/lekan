import axios, { AxiosError } from "axios"

import type { ApiErrorBody } from "./types"

/** `/api` is proxied to the backend by next.config.ts rewrites. */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api").replace(/\/+$/, "")

export class ApiError extends Error {
  readonly status: number
  readonly kind: "http" | "network" | "timeout"

  constructor(message: string, status: number, kind: ApiError["kind"] = "http") {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.kind = kind
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // A chat turn can take up to a minute; never cut it short.
  timeout: 120_000,
  headers: { "Content-Type": "application/json" },
})

function messageFromBody(data: unknown): string | null {
  if (!data) return null
  if (typeof data === "string") return data.trim() || null
  if (typeof data === "object" && "detail" in data) {
    const { detail } = data as ApiErrorBody
    if (typeof detail === "string") return detail
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ")
  }
  return null
}

function toApiError(error: AxiosError): ApiError {
  if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
    return new ApiError("Lekan took too long to answer. Please try again.", 0, "timeout")
  }

  if (!error.response) {
    return new ApiError("Can't reach the Lekan server. Check that the backend is running.", 0, "network")
  }

  const { status, data } = error.response
  const fromBody = messageFromBody(data)

  // 500s are plain-text "Internal Server Error" (usually OpenAI or Google trouble).
  if (status >= 500 && status !== 502) {
    return new ApiError("Something went wrong on Lekan's side. Please try again.", status)
  }

  return new ApiError(fromBody ?? `Request failed (${status})`, status)
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) return Promise.reject(toApiError(error))
    return Promise.reject(error)
  }
)
