import type { MePlanetContent, Paragraph, Satellite, SubSatellite } from './types'

// 不依賴 src/data：讓測試可以餵入任意靜態資料

export interface Content {
  satellites: Satellite[]
  subSatellites: SubSatellite[]
  paragraphs: Paragraph[]
  mePlanetContent: MePlanetContent
}

/** 回傳靜態資料中所有問題；空陣列 = 資料正確 */
export function findContentErrors(content: Content): string[] {
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

/** 讀取函式：陣列順序即顯示順序，不另外排序 */
export function createContentReader(content: Content) {
  return {
    listSatellites: (): Satellite[] => content.satellites,
    listSubSatellites: (satelliteId: number): SubSatellite[] =>
      content.subSatellites.filter((s) => s.satellite_id === satelliteId),
    listParagraphs: (subSatelliteId: number): Paragraph[] =>
      content.paragraphs.filter((p) => p.sub_satellite_id === subSatelliteId),
    getMePlanetContent: (): MePlanetContent => content.mePlanetContent,
  }
}
