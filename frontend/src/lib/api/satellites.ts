import type { Satellite, SatelliteInput } from '@/lib/types'

import { apiClient } from './client'

/** GET /satellites（operationId: listSatellites）— 公開，依建立時間舊→新 */
export function listSatellites(): Promise<Satellite[]> {
  return apiClient<Satellite[]>('/satellites')
}

/** POST /satellites（operationId: createSatellite） */
export function createSatellite(body: SatelliteInput): Promise<Satellite> {
  return apiClient<Satellite>('/satellites', { method: 'POST', body: JSON.stringify(body) })
}

/** PUT /satellites/{satelliteId}（operationId: updateSatellite） */
export function updateSatellite(satelliteId: number, body: SatelliteInput): Promise<Satellite> {
  return apiClient<Satellite>(`/satellites/${satelliteId}`, { method: 'PUT', body: JSON.stringify(body) })
}

/** DELETE /satellites/{satelliteId}（operationId: deleteSatellite）— 連帶刪除其子衛星與段落 */
export function deleteSatellite(satelliteId: number): Promise<void> {
  return apiClient<void>(`/satellites/${satelliteId}`, { method: 'DELETE' })
}
