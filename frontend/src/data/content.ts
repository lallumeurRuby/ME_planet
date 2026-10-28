import type { MePlanetContent, Paragraph, Satellite, SubSatellite } from '@/lib/types'

/*
 * 網站全部內容（靜態網站，無後台）。修改後重新 build／部署即生效。
 *   - 陣列順序 = 畫面顯示順序
 *   - id 在同一種資料內不可重複；satellite_id／sub_satellite_id 必須指向存在的上層，否則 build 失敗
 *   - 目前為示範資料，請替換成自己的內容
 */

export const satellites: Satellite[] = [
  { id: 1, name: '軟體開發' },
  { id: 2, name: '產品管理' },
  { id: 3, name: '閱讀書庫' },
]

// 產品管理、閱讀書庫暫無子衛星
export const subSatellites: SubSatellite[] = [
  { id: 11, satellite_id: 1, name: 'AIxBDD' },
  { id: 12, satellite_id: 1, name: '工作專案' },
]

export const paragraphs: Paragraph[] = [
    {
    id: 1203,
    sub_satellite_id: 12,
    title: 'GTB Space — 空間租賃與營運管理平台',
    summary: '聚典資訊｜Space Rental · Operations Platform',
    content: [
      '<ul>',
      '<li>與客戶端利害關係人合作，從前期需求探索、規格定義一路參與至開發交付，打造涵蓋預訂、付款與退款、會員制度、行銷、報表及內部營運流程的端到端空間租賃平台。</li>',
      '<li>運用 <strong>Event Storming</strong> 與 <strong>Gherkin</strong>，將模糊且頻繁變動的商業需求轉化為結構化產品規則與可執行規格，釐清包含訂單修改／取消、付款與發票調整、會員升降級、優惠券資格與報表邏輯等複雜流程。</li>',
      '<li>與後端工程師及 UI/UX 設計師跨職能協作，共同定義<strong>功能優先序、使用者流程、API／資料規格與介面行為</strong>，在技術可行性、營運需求與使用者體驗之間取得平衡。</li>',
      '<li>協助設計具彈性的系統架構，將不同租賃政策與合作夥伴特有的商業規則整合至單一營運平台，將租賃全流程中必要的人工操作節點由約 <strong>9 個降低至 2–3 個</strong>。</li>',
      '<li>參與前台官網的 <strong>SEO、前端效能優化與使用者流程改善</strong>，強化搜尋能見度、頁面反應速度與端到端預訂體驗。</li>',
      '</ul>',
    ].join(''),
    created_at: '2025-09-10',
    image: '/images/wp_gtb.jpg',
    link: 'https://www.gtbspace.com/',
  },
  {
    id: 1202,
    sub_satellite_id: 12,
    title: '高雄榮總 — AI 智慧照護平台',
    summary: '聚典資訊｜HealthTech · AI Care Platform',
    content: [
      '<ul>',
      '<li>參與 AI 智慧照護平台的產品規劃、流程設計、規格定義、前端開發與 AI 服務整合，涵蓋<strong>復健動作評估、營養辨識與多語照護溝通</strong>等功能。</li>',
      '<li>與設計師、後端工程師及 AI 團隊協作，將臨床與營運流程轉化為瀏覽器端產品體驗，並完成前端應用與 AI 推論服務的整合。</li>',
      '<li>協助系統部署至<strong>高雄榮總及旗下 14 間醫療機構</strong>，服務範圍涵蓋 <strong>500+</strong> 位長者。</li>',
      '<li>透過流程數位化，協助第一線人員降低 <strong>30%</strong> 的行政與紀錄工時。</li>',
      '</ul>',
    ].join(''),
    created_at: '2026-07-28',
    image: '/images/wp_kvgh.jpg',
  },
  {
    id: 1201,
    sub_satellite_id: 12,
    title: 'HOLMES 廣告平台與 Creative360 素材引擎',
    summary: 'CLICKFORCE 域動行銷｜Digital Marketing · MarTech',
    content: [
      '<p>HOLMES 整合 SSP（供應方平台）與 DSP（需求方平台），支援程式化廣告交易，協助媒體與廣告主實現高效曝光與精準投放；2025 年推出 AI 驅動的 Creative360，優化廣告素材的生成與投遞效率。</p>',
      '<ul>',
      '<li>負責 SSP、DSP 平台的前端開發與維護，與 PM 及 UX/UI 設計師合作，持續優化使用流程與操作體驗。</li>',
      '<li>從零參與新產品 Creative360 的前端開發，負責介面切版與樣式，並與後端協作 API 串接與資料整合，確保系統順利上線。</li>',
      '</ul>',
    ].join(''),
    created_at: '2025-03-28',
    image: '/images/wp_clickforce.png',
    tags: ['Vue', 'Nuxt.js', 'Tailwindcss', 'Element UI', 'Ant Design'],
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
