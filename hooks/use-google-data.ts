"use client"

import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/api/query-keys"
import { googleService } from "@/services/google.service"

const common = { retry: false, staleTime: 60_000 } as const

export function useUpcomingEvents(enabled: boolean) {
  return useQuery({ queryKey: queryKeys.google.events, queryFn: googleService.events, enabled, ...common })
}

export function useRecentEmails(enabled: boolean) {
  return useQuery({ queryKey: queryKeys.google.emails, queryFn: googleService.emails, enabled, ...common })
}

export function useRecentFiles(enabled: boolean) {
  return useQuery({ queryKey: queryKeys.google.files, queryFn: googleService.files, enabled, ...common })
}
