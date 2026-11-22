export const queryKeys = {
  health: ["health"] as const,
  authStatus: ["auth", "status"] as const,
  google: {
    emails: ["google", "emails"] as const,
    events: ["google", "events"] as const,
    files: ["google", "files"] as const,
  },
}

export const mutationKeys = {
  chat: ["chat"] as const,
}
