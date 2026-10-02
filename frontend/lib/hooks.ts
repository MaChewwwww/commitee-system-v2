import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { list, can } from "./api"
import type { Resource } from "./types"
export function useResource<K extends Resource>(resource: K, enabled = true) {
  return useQuery({
    queryKey: [resource],
    queryFn: ({ signal }) => list(resource, signal),
    enabled:
      enabled && can(window.APP_CONFIG, resource === "roles" ? "users.view" : `${resource}.view`),
    staleTime: 30_000,
    retry: false,
  })
}
// The synchronous lock closes the gap before React renders the pending state.
export function useAction<T, V = void>(
  action: (value: V) => Promise<T>,
  invalidate: Resource[] = [],
) {
  const client = useQueryClient()
  const lock = useRef(false)
  const mutation = useMutation({
    mutationFn: action,
    onSuccess: async () => {
      await Promise.all(
        invalidate.map((resource) => client.invalidateQueries({ queryKey: [resource] })),
      )
    },
  })
  async function run(value: V) {
    if (lock.current) return undefined
    lock.current = true
    try {
      return await mutation.mutateAsync(value)
    } finally {
      lock.current = false
    }
  }
  return { ...mutation, run }
}
