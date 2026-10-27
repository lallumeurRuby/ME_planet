import { http, HttpResponse } from 'msw'

import type { MePlanetContentInput } from '@/lib/types'

import { db, nowIso } from '../db'
import { API, requireOwner } from './shared'

export const mePlanetHandlers = [
  // GET /me-planet（公開）
  http.get(`${API}/me-planet`, () => HttpResponse.json(db.mePlanetContent)),

  // PUT /me-planet（upsert，整份覆蓋；"" 或 null 即清空）
  http.put(`${API}/me-planet`, async ({ request }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const body = (await request.json()) as MePlanetContentInput
    db.mePlanetContent = { content: body.content || null, updated_at: nowIso() }
    return HttpResponse.json(db.mePlanetContent)
  }),
]
