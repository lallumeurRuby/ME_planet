import { HttpResponse } from 'msw'

import type { ErrorCode } from '@/lib/types'
import { NAME_MAX_LENGTH } from '@/lib/types'

// 任意 origin + /api（瀏覽器與 Node 測試環境皆可匹配）；path 與 api.yml 一致
export const API = '*/api'

const JWT_EXPIRE_MS = 24 * 60 * 60 * 1000
const MOCK_SIGNATURE = 'mock-signature'
const base64url = (value: object) =>
  btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

export function errorResponse(status: number, code: ErrorCode, message: string) {
  return HttpResponse.json({ code, message }, { status })
}

/** 產生形狀與真 JWT 相同的 mock token（前端可解出 exp），簽章固定為 mock-signature */
export function issueMockToken(): string {
  const iat = Math.floor(Date.now() / 1000)
  const exp = Math.floor((Date.now() + JWT_EXPIRE_MS) / 1000)
  return `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url({ sub: 'owner', iat, exp })}.${MOCK_SIGNATURE}`
}

/** 寫入 API 的身份檢查：未帶、無效或過期一律 401 UNAUTHORIZED */
export function requireOwner(request: Request) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/, '')
  if (!token) return errorResponse(401, 'UNAUTHORIZED', '請先登入')
  const [, payload, signature] = token.split('.')
  try {
    const { exp } = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    if (signature !== MOCK_SIGNATURE || exp * 1000 <= Date.now()) throw new Error('invalid')
  } catch {
    return errorResponse(401, 'UNAUTHORIZED', '登入已失效，請重新登入')
  }
  return null
}

/** 衛星／子衛星名稱：必填、≤ 50 字 */
export function validateName(name: unknown) {
  if (typeof name !== 'string' || name === '') return errorResponse(400, 'REQUIRED_FIELD_EMPTY', '名稱為必填')
  if (Array.from(name).length > NAME_MAX_LENGTH)
    return errorResponse(400, 'FIELD_TOO_LONG', `名稱不可超過 ${NAME_MAX_LENGTH} 字`)
  return null
}
