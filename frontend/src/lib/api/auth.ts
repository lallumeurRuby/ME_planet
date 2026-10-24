import type { LoginRequest, LoginResponse } from '@/lib/types'

import { apiClient } from './client'

const AUTH_COOKIE = 'auth-token'

/** POST /auth/login（operationId: login） */
export function login(body: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) })
}

/** 登入成功後保存 JWT；client.ts 會從此 cookie 帶 Bearer token。有效期與 JWT exp 一致（24 小時） */
export function saveAuthToken(token: string): void {
  const exp = readTokenExpiry(token)
  const expires = exp ? `; expires=${exp.toUTCString()}` : ''
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; SameSite=Lax${expires}`
}

export function clearAuthToken(): void {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`
}

export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null
  return document.cookie.match(/(?:^|;\s*)auth-token=([^;]*)/)?.[1] ?? null
}

/** 解出 JWT 的 exp（只讀取，不驗證簽章；驗證由後端負責） */
export function readTokenExpiry(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' ? new Date(payload.exp * 1000) : null
  } catch {
    return null
  }
}
