import { API_BASE_URL, apiClient } from "@/lib/api/client"
import type { AuthStatus, HealthResponse } from "@/lib/api/types"

export const authService = {
  async health() {
    const { data } = await apiClient.get<HealthResponse>("/health")
    return data
  },

  async status() {
    const { data } = await apiClient.get<AuthStatus>("/auth/status")
    return data
  },

  /** A browser navigation, never a fetch: it 307s to Google's sign-in page. */
  connectUrl: `${API_BASE_URL}/auth/google`,
}

export function needsGoogleConnection(status: AuthStatus | undefined) {
  if (!status) return false
  if (!status.connected) return true
  return status.needs_reconnect || status.has_refresh_token === false
}
