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
  /** 選填：public/ 下的圖片路徑（如 /images/xxx.png）；有圖片時段落以「左圖右文」兩欄呈現 */
  image?: string
  /** 選填：外部連結；有值時標題可點擊，於新分頁開啟 */
  link?: string
  /** 選填：標籤（如技術棧），顯示於內容下方 */
  tags?: string[]
}

export interface MePlanetContent {
  /** rich text（HTML）；null 或空字串時 Modal 顯示空狀態 */
  content: string | null
}
