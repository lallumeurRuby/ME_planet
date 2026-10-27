/** 2026-03-01 → 2026.03.01（直接處理字串，不受時區影響） */
export function formatDate(date: string): string {
  return date.replaceAll('-', '.')
}
