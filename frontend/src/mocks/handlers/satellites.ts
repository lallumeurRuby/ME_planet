import { http, HttpResponse } from 'msw'

import type { Satellite, SatelliteInput } from '@/lib/types'

import { byOldest, db, nowIso } from '../db'
import { API, errorResponse, requireOwner, validateName } from './shared'

const findSatellite = (id: unknown) => db.satellites.find((s) => s.id === Number(id))
const isDuplicated = (name: string, excludeId?: number) =>
  db.satellites.some((s) => s.name === name && s.id !== excludeId)

export const satelliteHandlers = [
  // GET /satellites（公開，舊→新）
  http.get(`${API}/satellites`, () => HttpResponse.json([...db.satellites].sort(byOldest))),

  // POST /satellites
  http.post(`${API}/satellites`, async ({ request }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const { name } = (await request.json()) as Partial<SatelliteInput>
    const invalid = validateName(name)
    if (invalid) return invalid
    if (isDuplicated(name!)) return errorResponse(409, 'NAME_DUPLICATED', `衛星名稱「${name}」已存在`)
    const satellite: Satellite = { id: db.nextId++, name: name!, created_at: nowIso() }
    db.satellites.push(satellite)
    return HttpResponse.json(satellite, { status: 201 })
  }),

  // PUT /satellites/:satelliteId
  http.put(`${API}/satellites/:satelliteId`, async ({ request, params }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const satellite = findSatellite(params.satelliteId)
    if (!satellite) return errorResponse(404, 'NOT_FOUND', `找不到衛星 ${params.satelliteId}`)
    const { name } = (await request.json()) as Partial<SatelliteInput>
    const invalid = validateName(name)
    if (invalid) return invalid
    if (isDuplicated(name!, satellite.id)) return errorResponse(409, 'NAME_DUPLICATED', `衛星名稱「${name}」已存在`)
    satellite.name = name!
    return HttpResponse.json(satellite)
  }),

  // DELETE /satellites/:satelliteId（連帶刪除其子衛星與段落）
  http.delete(`${API}/satellites/:satelliteId`, ({ request, params }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const satellite = findSatellite(params.satelliteId)
    if (!satellite) return errorResponse(404, 'NOT_FOUND', `找不到衛星 ${params.satelliteId}`)
    const subSatelliteIds = new Set(
      db.subSatellites.filter((u) => u.satellite_id === satellite.id).map((u) => u.id)
    )
    db.paragraphs = db.paragraphs.filter((p) => !subSatelliteIds.has(p.sub_satellite_id))
    db.subSatellites = db.subSatellites.filter((u) => u.satellite_id !== satellite.id)
    db.satellites = db.satellites.filter((s) => s.id !== satellite.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
