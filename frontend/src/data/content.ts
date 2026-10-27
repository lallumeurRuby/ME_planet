import type { MePlanetContent, Paragraph, Satellite, SubSatellite } from '@/lib/types'

/*
 * 網站全部內容（靜態網站，無後台）。修改後重新 build／部署即生效。
 *   - 陣列順序 = 畫面顯示順序
 *   - id 在同一種資料內不可重複；satellite_id／sub_satellite_id 必須指向存在的上層，否則 build 失敗
 *   - 目前為示範資料，請替換成自己的內容
 */

export const satellites: Satellite[] = [
  { id: 1, name: '天文' },
  { id: 2, name: '程式設計' },
  { id: 3, name: '音樂' },
]

export const subSatellites: SubSatellite[] = [
  { id: 11, satellite_id: 1, name: '星系' },
  { id: 12, satellite_id: 1, name: '行星' },
  { id: 13, satellite_id: 1, name: '彗星' },
  { id: 14, satellite_id: 1, name: '黑洞' },
  { id: 21, satellite_id: 2, name: '演算法' },
]

export const paragraphs: Paragraph[] = [
  {
    id: 103,
    sub_satellite_id: 11,
    title: '仙女座星系',
    summary: '距離最近的大星系',
    content: '<p>仙女座星系是螺旋星系。</p>',
    created_at: '2026-03-03',
  },
  {
    id: 104,
    sub_satellite_id: 11,
    title: '太陽系簡介',
    summary: null,
    content: '<p>太陽系有八大行星。</p>',
    created_at: '2026-03-02',
  },
  {
    id: 102,
    sub_satellite_id: 11,
    title: '麥哲倫雲',
    summary: null,
    content: '<p>麥哲倫雲是矮星系。</p>',
    created_at: '2026-03-02',
  },
  {
    id: 101,
    sub_satellite_id: 11,
    title: '銀河系簡介',
    summary: '我們所在的星系',
    content: '<p>銀河系是一個棒旋星系。</p>',
    created_at: '2026-03-01',
  },
  {
    id: 105,
    sub_satellite_id: 12,
    title: '火星筆記',
    summary: '紅色星球',
    content: '<p>火星有兩顆衛星。</p>',
    created_at: '2026-03-04',
  },
]

export const mePlanetContent: MePlanetContent = {
  content: '<p>我是 Ruby，喜歡天文與程式設計。</p>',
}
