import type { Paragraph, ParagraphCreateInput, ParagraphUpdateInput } from '@/lib/types'

import { apiClient } from './client'

/** GET /sub-satellites/{subSatelliteId}/paragraphs（operationId: listParagraphs）— 公開，新→舊 */
export function listParagraphs(subSatelliteId: number): Promise<Paragraph[]> {
  return apiClient<Paragraph[]>(`/sub-satellites/${subSatelliteId}/paragraphs`)
}

/** POST /sub-satellites/{subSatelliteId}/paragraphs（operationId: createParagraph） */
export function createParagraph(subSatelliteId: number, body: ParagraphCreateInput): Promise<Paragraph> {
  return apiClient<Paragraph>(`/sub-satellites/${subSatelliteId}/paragraphs`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** PUT /paragraphs/{paragraphId}（operationId: updateParagraph）— 整筆覆蓋，summary 送 null 即清空 */
export function updateParagraph(paragraphId: number, body: ParagraphUpdateInput): Promise<Paragraph> {
  return apiClient<Paragraph>(`/paragraphs/${paragraphId}`, { method: 'PUT', body: JSON.stringify(body) })
}

/** DELETE /paragraphs/{paragraphId}（operationId: deleteParagraph） */
export function deleteParagraph(paragraphId: number): Promise<void> {
  return apiClient<void>(`/paragraphs/${paragraphId}`, { method: 'DELETE' })
}
