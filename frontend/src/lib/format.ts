/** 2026-03-01T00:00:00+00:00 → 2026.03.01 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

/** 字數：以字元（code point）計算，與後端長度驗證一致 */
export const charCount = (value: string) => Array.from(value).length
