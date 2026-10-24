import { http, HttpResponse } from 'msw'

import type { Paragraph, ParagraphCreateInput, ParagraphUpdateInput } from '@/lib/types'
import { TITLE_MAX_LENGTH } from '@/lib/types'

import { byOldest, db, nowIso } from '../db'
import { API, errorResponse, requireOwner } from './shared'

const findSubSatellite = (id: unknown) => db.subSatellites.find((u) => u.id === Number(id))
const findParagraph = (id: unknown) => db.paragraphs.find((p) => p.id === Number(id))

/** 標題、內容必填；標題 ≤ 100 字 */
function validateFields(title: unknown, content: unknown) {
  if (typeof title !== 'string' || !title || typeof content !== 'string' || !content)
    return errorResponse(400, 'REQUIRED_FIELD_EMPTY', '標題與內容為必填')
  if (Array.from(title).length > TITLE_MAX_LENGTH)
    return errorResponse(400, 'FIELD_TOO_LONG', `標題不可超過 ${TITLE_MAX_LENGTH} 字`)
  return null
}

export const paragraphHandlers = [
  // GET /sub-satellites/:subSatelliteId/paragraphs（公開，新→舊）
  http.get(`${API}/sub-satellites/:subSatelliteId/paragraphs`, ({ params }) => {
    const subSatellite = findSubSatellite(params.subSatelliteId)
    if (!subSatellite) return errorResponse(404, 'NOT_FOUND', `找不到子衛星 ${params.subSatelliteId}`)
    return HttpResponse.json(
      db.paragraphs.filter((p) => p.sub_satellite_id === subSatellite.id).sort((a, b) => byOldest(b, a))
    )
  }),

  // POST /sub-satellites/:subSatelliteId/paragraphs
  http.post(`${API}/sub-satellites/:subSatelliteId/paragraphs`, async ({ request, params }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const subSatellite = findSubSatellite(params.subSatelliteId)
    if (!subSatellite) return errorResponse(404, 'NOT_FOUND', `找不到子衛星 ${params.subSatelliteId}`)
    const body = (await request.json()) as Partial<ParagraphCreateInput>
    const invalid = validateFields(body.title, body.content)
    if (invalid) return invalid
    const now = nowIso()
    const paragraph: Paragraph = {
      id: db.nextId++,
      sub_satellite_id: subSatellite.id,
      title: body.title!,
      summary: body.summary ?? null,
      content: body.content!,
      created_at: now,
      updated_at: now,
    }
    db.paragraphs.push(paragraph)
    return HttpResponse.json(paragraph, { status: 201 })
  }),

  // PUT /paragraphs/:paragraphId（整筆覆蓋；summary 送 null 即清空）
  http.put(`${API}/paragraphs/:paragraphId`, async ({ request, params }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const paragraph = findParagraph(params.paragraphId)
    if (!paragraph) return errorResponse(404, 'NOT_FOUND', `找不到段落 ${params.paragraphId}`)
    const body = (await request.json()) as Partial<ParagraphUpdateInput>
    const invalid = validateFields(body.title, body.content)
    if (invalid) return invalid
    Object.assign(paragraph, {
      title: body.title!,
      summary: body.summary ?? null,
      content: body.content!,
      updated_at: nowIso(),
    })
    return HttpResponse.json(paragraph)
  }),

  // DELETE /paragraphs/:paragraphId
  http.delete(`${API}/paragraphs/:paragraphId`, ({ request, params }) => {
    const unauthorized = requireOwner(request)
    if (unauthorized) return unauthorized
    const paragraph = findParagraph(params.paragraphId)
    if (!paragraph) return errorResponse(404, 'NOT_FOUND', `找不到段落 ${params.paragraphId}`)
    db.paragraphs = db.paragraphs.filter((p) => p.id !== paragraph.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
