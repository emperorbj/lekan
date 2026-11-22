"use client"

import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/api/query-keys"
import { authService } from "@/services/auth.service"

export function useHealth(enabled = true) {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: authService.health,
    enabled,
    retry: 1,
    staleTime: 30_000,
    refetchInterval: (query) => (query.state.status === "error" ? 10_000 : false),
  })
}
