import * as data from '@/data/content'

import type { MePlanetContent, Paragraph, Satellite, SubSatellite } from './types'

/** 回傳靜態資料中所有問題；空陣列 = 資料正確 */
export function findContentErrors(content: typeof data): string[] {
  const errors: string[] = []
  const checkUniqueIds = (label: string, items: { id: number }[]) => {
    const seen = new Set<number>()
    for (const { id } of items) {
      if (seen.has(id)) errors.push(`${label} id ${id} 重複`)
      seen.add(id)
    }
  }
  checkUniqueIds('衛星', content.satellites)
  checkUniqueIds('子衛星', content.subSatellites)
  checkUniqueIds('段落', content.paragraphs)

  const satelliteIds = new Set(content.satellites.map((s) => s.id))
  for (const sub of content.subSatellites) {
    if (!satelliteIds.has(sub.satellite_id))
      errors.push(`子衛星「${sub.name}」（id ${sub.id}）的 satellite_id ${sub.satellite_id} 不存在`)
  }
  const subIds = new Set(content.subSatellites.map((s) => s.id))
  for (const paragraph of content.paragraphs) {
    if (!subIds.has(paragraph.sub_satellite_id))
      errors.push(`段落「${paragraph.title}」（id ${paragraph.id}）的 sub_satellite_id ${paragraph.sub_satellite_id} 不存在`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(paragraph.created_at))
      errors.push(`段落「${paragraph.title}」（id ${paragraph.id}）的 created_at 須為 YYYY-MM-DD`)
  }
  return errors
}

// 靜態匯出時頁面會在 build 期間執行此模組：資料有誤就讓 build 失敗
const errors = findContentErrors(data)
if (errors.length) throw new Error(`src/data/content.ts 資料有誤：\n- ${errors.join('\n- ')}`)

export const listSatellites = (): Satellite[] => data.satellites

export const listSubSatellites = (satelliteId: number): SubSatellite[] =>
  data.subSatellites.filter((s) => s.satellite_id === satelliteId)

export const listParagraphs = (subSatelliteId: number): Paragraph[] =>
  data.paragraphs.filter((p) => p.sub_satellite_id === subSatelliteId)

export const getMePlanetContent = (): MePlanetContent => data.mePlanetContent
