import { http, HttpResponse } from 'msw'

import type { LoginRequest } from '@/lib/types'

import { db } from '../db'
import { MOCK_OWNER_PASSWORD } from '../fixtures'
import { API, errorResponse, issueMockToken } from './shared'

const MAX_FAILED_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000

export const authHandlers = [
  // POST /auth/login
  http.post(`${API}/auth/login`, async ({ request }) => {
    const { password } = (await request.json()) as Partial<LoginRequest>
    if (!password) return errorResponse(400, 'REQUIRED_FIELD_EMPTY', '密碼為必填')

    const state = db.login
    const now = Date.now()
    if (state.lockedUntil !== null) {
      if (now < state.lockedUntil) return errorResponse(429, 'LOGIN_LOCKED', '登入已鎖定，請稍後再試')
      state.failedAttempts = 0
      state.lockedUntil = null
    }

    if (password !== MOCK_OWNER_PASSWORD) {
      state.failedAttempts += 1
      if (state.failedAttempts >= MAX_FAILED_ATTEMPTS) state.lockedUntil = now + LOCK_MS
      return errorResponse(401, 'INVALID_PASSWORD', '密碼錯誤')
    }

    state.failedAttempts = 0
    return HttpResponse.json({ token: issueMockToken() })
  }),
]
