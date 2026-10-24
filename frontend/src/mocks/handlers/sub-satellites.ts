import { http, HttpResponse } from 'msw'

import type { SubSatellite, SubSatelliteInput } from '@/lib/types'

import { byOldest, db, nowIso } from '../db'
import { API, errorResponse, requireOwner, validateName } from './shared'

const findSatellite = (id: unknown) => db.satellites.find((s) => s.id === Number(id))
const findSubSatellite = (id: unknown) => db.subSatellites.find((u) => u.id === Number(id))
const isDuplicated = (satelliteId: number, name: string, excludeId?: number) =>
  db.subSatellites.some((u) => u.satellite_id === satelliteId && u.name === name && u.id !== excludeId)

export const subSatelliteHandlers = [
  // GET /satellites/:satelliteId/sub-satellites（公開，舊→新）
  http.get(`${API}/satellites/:satelliteId/sub-satellites`, ({ params }) => {
    const satellite = findSatellite(params.satelliteId)
    if (!satellite) return errorResponse(404, 'NOT_FOUND', `找不到衛星 ${params.satelliteId}`)
    return HttpResponse.json(db.subSatellites.filter((u) => u.satellite_id === satellite.id).sort(byOldest))
  }),

  // POST /satellites/:satelliteId/sub-satellites
  http.post(`${API}/satellites/:satelliteId/sub-satellites`, async ({ request, params }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const satellite = findSatellite(params.satelliteId)
    if (!satellite) return errorResponse(404, 'NOT_FOUND', `找不到衛星 ${params.satelliteId}`)
    const { name } = (await request.json()) as Partial<SubSatelliteInput>
    const invalid = validateName(name)
    if (invalid) return invalid
    if (isDuplicated(satellite.id, name!))
      return errorResponse(409, 'NAME_DUPLICATED', `此衛星底下已有子衛星「${name}」`)
    const subSatellite: SubSatellite = { id: db.nextId++, satellite_id: satellite.id, name: name!, created_at: nowIso() }
    db.subSatellites.push(subSatellite)
    return HttpResponse.json(subSatellite, { status: 201 })
  }),

  // PUT /sub-satellites/:subSatelliteId（只改 name）
  http.put(`${API}/sub-satellites/:subSatelliteId`, async ({ request, params }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const subSatellite = findSubSatellite(params.subSatelliteId)
    if (!subSatellite) return errorResponse(404, 'NOT_FOUND', `找不到子衛星 ${params.subSatelliteId}`)
    const { name } = (await request.json()) as Partial<SubSatelliteInput>
    const invalid = validateName(name)
    if (invalid) return invalid
    if (isDuplicated(subSatellite.satellite_id, name!, subSatellite.id))
      return errorResponse(409, 'NAME_DUPLICATED', `此衛星底下已有子衛星「${name}」`)
    subSatellite.name = name!
    return HttpResponse.json(subSatellite)
  }),

  // DELETE /sub-satellites/:subSatelliteId（底下須無段落）
  http.delete(`${API}/sub-satellites/:subSatelliteId`, ({ request, params }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const subSatellite = findSubSatellite(params.subSatelliteId)
    if (!subSatellite) return errorResponse(404, 'NOT_FOUND', `找不到子衛星 ${params.subSatelliteId}`)
    if (db.paragraphs.some((p) => p.sub_satellite_id === subSatellite.id))
      return errorResponse(409, 'HAS_CHILDREN', '子衛星底下仍有段落，無法刪除')
    db.subSatellites = db.subSatellites.filter((u) => u.id !== subSatellite.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
