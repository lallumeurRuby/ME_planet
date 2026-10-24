import type { Paragraph, Satellite, SubSatellite } from '@/lib/types'

/*
 * 固定資料：全部取自 backend/tests/features 的 Given 步驟。
 *   衛星／子衛星：探索衛星.feature、刪除衛星.feature、編輯子衛星.feature
 *   段落：查看段落.feature、刪除段落.feature
 *   擁有者密碼：進入後台.feature
 */

export const MOCK_OWNER_PASSWORD = 'Orbit#2026'

export const mockSatellites: Satellite[] = [
  { id: 1, name: '天文', created_at: '2026-01-01T00:00:00+00:00' },
  { id: 2, name: '程式設計', created_at: '2026-01-02T00:00:00+00:00' },
  { id: 3, name: '音樂', created_at: '2026-01-03T00:00:00+00:00' },
]

export const mockSubSatellites: SubSatellite[] = [
  { id: 11, satellite_id: 1, name: '星系', created_at: '2026-02-01T00:00:00+00:00' },
  { id: 12, satellite_id: 1, name: '行星', created_at: '2026-02-02T00:00:00+00:00' },
  { id: 13, satellite_id: 1, name: '彗星', created_at: '2026-02-03T00:00:00+00:00' },
  { id: 14, satellite_id: 1, name: '黑洞', created_at: '2026-02-03T00:00:00+00:00' },
  { id: 21, satellite_id: 2, name: '演算法', created_at: '2026-02-01T00:00:00+00:00' },
]

const paragraph = (
  id: number,
  sub_satellite_id: number,
  title: string,
  summary: string | null,
  content: string,
  created_at: string
): Paragraph => ({ id, sub_satellite_id, title, summary, content, created_at, updated_at: created_at })

export const mockParagraphs: Paragraph[] = [
  paragraph(101, 11, '銀河系簡介', '我們所在的星系', '<p>銀河系是一個棒旋星系。</p>', '2026-03-01T00:00:00+00:00'),
  paragraph(102, 11, '麥哲倫雲', null, '<p>麥哲倫雲是矮星系。</p>', '2026-03-02T00:00:00+00:00'),
  paragraph(103, 11, '仙女座星系', '距離最近的大星系', '<p>仙女座星系是螺旋星系。</p>', '2026-03-03T00:00:00+00:00'),
  paragraph(104, 11, '太陽系簡介', null, '<p>太陽系有八大行星。</p>', '2026-03-02T12:00:00+00:00'),
  paragraph(105, 12, '火星筆記', '紅色星球', '<p>火星有兩顆衛星。</p>', '2026-03-04T00:00:00+00:00'),
]
