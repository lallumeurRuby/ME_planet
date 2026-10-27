import type { MePlanetContent, Paragraph, Satellite, SubSatellite } from '@/lib/types'

import { mockMePlanetContent, mockParagraphs, mockSatellites, mockSubSatellites } from './fixtures'

/** MSW 用的記憶體資料庫：讓開發時的新增／編輯／刪除可以連續操作（重新整理即重置） */
export const db = {
  satellites: structuredClone(mockSatellites) as Satellite[],
  subSatellites: structuredClone(mockSubSatellites) as SubSatellite[],
  paragraphs: structuredClone(mockParagraphs) as Paragraph[],
  mePlanetContent: structuredClone(mockMePlanetContent) as MePlanetContent,
  nextId: 1000,
  login: { failedAttempts: 0, lockedUntil: null as number | null },
}

export const nowIso = () => new Date().toISOString()
export const byOldest = <T extends { id: number; created_at: string }>(a: T, b: T) =>
  a.created_at.localeCompare(b.created_at) || a.id - b.id
