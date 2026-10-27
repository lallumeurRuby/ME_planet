// 靜態內容的資料結構（src/data/content.ts）；陣列順序即顯示順序

export interface Satellite {
  id: number
  name: string
}

export interface SubSatellite {
  id: number
  satellite_id: number
  name: string
}

export interface Paragraph {
  id: number
  sub_satellite_id: number
  title: string
  summary: string | null
  /** rich text（HTML），顯示前經 sanitizeRichText 處理 */
  content: string
  /** YYYY-MM-DD，僅用於顯示 */
  created_at: string
}

export interface MePlanetContent {
  /** rich text（HTML）；null 或空字串時 Modal 顯示空狀態 */
  content: string | null
}
