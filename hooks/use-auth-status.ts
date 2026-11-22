"use client"

import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/api/query-keys"
import { authService, needsGoogleConnection } from "@/services/auth.service"

interface Options {
  enabled?: boolean
  /** Poll every 2.5s until Google is connected (while the OAuth tab is open). */
  pollUntilConnected?: boolean
}

export function useAuthStatus({ enabled = true, pollUntilConnected = false }: Options = {}) {
  const query = useQuery({
    queryKey: queryKeys.authStatus,
    queryFn: authService.status,
    enabled,
    retry: 1,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    refetchInterval: (q) =>
      pollUntilConnected && needsGoogleConnection(q.state.data) ? 2_500 : false,
  })

  return {
    ...query,
    isConnected: query.data ? !needsGoogleConnection(query.data) : false,
    needsConnection: needsGoogleConnection(query.data),
  }
}
