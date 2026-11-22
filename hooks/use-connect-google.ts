"use client"

import { useCallback, useState } from "react"

import { authService } from "@/services/auth.service"

import { useAuthStatus } from "./use-auth-status"

/**
 * The OAuth callback returns JSON instead of redirecting back (docs/API.md §5.3),
 * so we open Google in a new tab and poll /auth/status until it's connected.
 */
export function useConnectGoogle() {
  const [waiting, setWaiting] = useState(false)
  const auth = useAuthStatus({ pollUntilConnected: waiting })

  const connect = useCallback(() => {
    window.open(authService.connectUrl, "_blank", "noopener,noreferrer")
    setWaiting(true)
  }, [])

  return {
    connect,
    recheck: auth.refetch,
    isWaiting: waiting && auth.needsConnection,
    isChecking: auth.isFetching,
    auth,
  }
}
