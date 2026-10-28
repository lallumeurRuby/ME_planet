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
  // 第一個 <h3> 區塊顯示在照片右側，其餘全寬顯示；每段經歷以 <div> 包起來呈現為時間軸
  content: [
    '<h3>關於我</h3>',
    '<p>我是一位具備約 3 年經驗的前端工程師，致力於朝產品經理（PM）發展。</p>',
    '<p>曾參與企業營運平台、數位廣告、醫療照護及 AI 產品開發，累積需求分析、產品規格定義、使用者流程設計與跨職能協作經驗。</p>',
    '<p>我擅長從使用者需求出發，結合技術思維與產品視角，將複雜問題轉化為清晰、可執行的解決方案。</p>',

    '<h3>Work Experience｜工作經歷</h3>',
    '<div><p><strong>聚典資訊股份有限公司</strong><span>前端工程師</span><em>2025 – Present</em></p><ul>',
    '<li>參與空間租賃營運平台及 AI 智慧照護產品開發。</li>',
    '<li>負責需求釐清、產品規格定義與跨職能協作。</li>',
    '<li>推動流程優化，將人工操作節點由約 9 個減少至 2–3 個。</li>',
    '</ul></div>',
    '<div><p><strong>域動行銷股份有限公司</strong><span>前端工程師</span><em>2024 – 2025</em></p><ul>',
    '<li>參與數位廣告平台、財務請款系統與 AI 產品開發。</li>',
    '<li>與 PM、設計及後端團隊協作，規劃使用者流程與技術方案。</li>',
    '</ul></div>',
    '<div><p><strong>美商雷技資訊科技有限公司</strong><span>前端工程師</span><em>2022 – 2023</em></p><ul>',
    '<li>參與企業級 EHS 與化學品管理系統開發。</li>',
    '<li>負責前端功能、資料視覺化及網站優化。</li>',
    '</ul></div>',

    '<h3>Education｜學歷</h3>',
    '<div><p><strong>國立政治大學</strong><span>外交學系、土耳其語文學系</span><em>2017 – 2021</em></p></div>',
  ].join(''),
}
