import type { AppConfig, Resource, Resources, ApiResult } from "./types"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}
export function can(config: Pick<AppConfig, "role" | "permissions">, permission: string) {
  return config.role === "super_admin" || config.permissions.includes(permission)
}
export function apiUrl(path: string, config = window.APP_CONFIG) {
  return `${config.api.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}
export async function request<T>(
  path: string,
  method = "GET",
  payload?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method,
    credentials: "same-origin",
    signal,
    ...(payload === undefined
      ? {}
      : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
  })
  if (response.status === 401 && window.APP_CONFIG.page !== "login") {
    window.location.assign(window.APP_CONFIG.login)
    throw new ApiError("Your session expired. Please sign in again.", 401)
  }
  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new ApiError(
      "The server returned an unreadable response. Please try again.",
      response.status,
    )
  }
  const result = data as {
    success?: boolean
    message?: string
    error?: string
    authenticated?: boolean
  }
  if (!response.ok || result?.success === false || result?.authenticated === false) {
    throw new ApiError(
      result?.message ||
        result?.error ||
        (response.status === 403
          ? "You do not have permission for this action."
          : "The request could not be completed."),
      response.status,
    )
  }
  return data as T
}
export async function list<K extends Resource>(
  resource: K,
  signal?: AbortSignal,
): Promise<Resources[K][]> {
  const result = await request<Resources[K][] | { data: Resources[K][] }>(
    `${resource}/index.php`,
    "GET",
    undefined,
    signal,
  )
  const rows = Array.isArray(result) ? result : result?.data
  if (!Array.isArray(rows)) throw new ApiError(`Unable to read ${resource} data.`, 502)
  return rows
}
export function save(resource: Resource, payload: object, editing = false) {
  return request<ApiResult>(`${resource}/index.php`, editing ? "PUT" : "POST", payload)
}
export function remove(resource: Resource, id: string) {
  return request<ApiResult>(`${resource}/index.php`, "DELETE", { id })
}
