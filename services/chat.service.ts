import { apiClient } from "@/lib/api/client"
import type { ApprovalRequest, ChatRequest, ChatResponse } from "@/lib/api/types"

export const chatService = {
  async send(body: ChatRequest) {
    const { data } = await apiClient.post<ChatResponse>("/chat", body)
    return data
  },

  async approve(body: ApprovalRequest) {
    const { data } = await apiClient.post<ChatResponse>("/chat/approve", body)
    return data
  },
}
