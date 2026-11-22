import { apiClient } from "@/lib/api/client"
import type { CalendarEvent, DriveFile, Email } from "@/lib/api/types"

export const googleService = {
  async emails() {
    const { data } = await apiClient.get<Email[]>("/google/emails")
    return data
  },

  async events() {
    const { data } = await apiClient.get<CalendarEvent[]>("/google/events")
    return data
  },

  async files() {
    const { data } = await apiClient.get<DriveFile[]>("/google/files")
    return data
  },
}
