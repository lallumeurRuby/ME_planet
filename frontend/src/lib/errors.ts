import { ApiClientError } from '@/lib/api'
import type { ErrorCode } from '@/lib/types'

/** api.yml 錯誤代碼 → 使用者看得懂的訊息（後端 message 只作為後備） */
const MESSAGES: Record<ErrorCode, string> = {
  UNAUTHORIZED: '登入已失效，請重新登入',
  INVALID_PASSWORD: '密碼錯誤',
  LOGIN_LOCKED: '登入已鎖定，請 15 分鐘後再試',
  REQUIRED_FIELD_EMPTY: '必填欄位不可為空',
  FIELD_TOO_LONG: '超過字數上限',
  NOT_FOUND: '找不到這筆資料，可能已被刪除',
  NAME_DUPLICATED: '名稱已存在',
}

export const errorCodeOf = (error: unknown): string | null =>
  error instanceof ApiClientError ? error.code : null

export function errorMessageOf(error: unknown): string {
  if (error instanceof ApiClientError) return MESSAGES[error.code as ErrorCode] ?? error.message
  return '連線發生問題，請稍後再試'
}
