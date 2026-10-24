const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

// api.yml：成功直接回傳資源／陣列（無 envelope）；錯誤統一為 { code, message }
interface ApiError {
  code: string
  message: string
}

/**
 * Shared HTTP client for all API calls.
 * Worker should NOT create separate fetch logic — use this client.
 *
 * Auth: reads `auth-token` from document.cookie and sends as Bearer token.
 * This is production-safe — no mock-specific logic here.
 */
export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Read auth token from cookie (set by login page)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)auth-token=([^;]*)/)
    if (match) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${match[1]}`
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error: ApiError = await res
      .json()
      .catch(() => ({ code: 'UNKNOWN', message: res.statusText }))
    throw new ApiClientError(error.code, error.message, res.status)
  }

  // 204 No Content（DELETE）沒有 body
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}
