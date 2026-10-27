import type { MePlanetContent, MePlanetContentInput } from '@/lib/types'

import { apiClient } from './client'

/** GET /me-planet（operationId: getMePlanetContent）— 公開；從未設定時 content、updated_at 為 null */
export function getMePlanetContent(): Promise<MePlanetContent> {
  return apiClient<MePlanetContent>('/me-planet')
}

/** PUT /me-planet（operationId: updateMePlanetContent）— upsert，整份覆蓋；content 送 "" 或 null 即清空 */
export function updateMePlanetContent(body: MePlanetContentInput): Promise<MePlanetContent> {
  return apiClient<MePlanetContent>('/me-planet', { method: 'PUT', body: JSON.stringify(body) })
}
