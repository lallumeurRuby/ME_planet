import type { SubSatellite, SubSatelliteInput } from '@/lib/types'

import { apiClient } from './client'

/** GET /satellites/{satelliteId}/sub-satellites（operationId: listSubSatellites）— 公開，舊→新 */
export function listSubSatellites(satelliteId: number): Promise<SubSatellite[]> {
  return apiClient<SubSatellite[]>(`/satellites/${satelliteId}/sub-satellites`)
}

/** POST /satellites/{satelliteId}/sub-satellites（operationId: createSubSatellite） */
export function createSubSatellite(satelliteId: number, body: SubSatelliteInput): Promise<SubSatellite> {
  return apiClient<SubSatellite>(`/satellites/${satelliteId}/sub-satellites`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** PUT /sub-satellites/{subSatelliteId}（operationId: updateSubSatellite）— 只改 name */
export function updateSubSatellite(subSatelliteId: number, body: SubSatelliteInput): Promise<SubSatellite> {
  return apiClient<SubSatellite>(`/sub-satellites/${subSatelliteId}`, { method: 'PUT', body: JSON.stringify(body) })
}

/** DELETE /sub-satellites/{subSatelliteId}（operationId: deleteSubSatellite）— 底下仍有段落時 409 HAS_CHILDREN */
export function deleteSubSatellite(subSatelliteId: number): Promise<void> {
  return apiClient<void>(`/sub-satellites/${subSatelliteId}`, { method: 'DELETE' })
}
