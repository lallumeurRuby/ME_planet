@query
Feature: 查看段落筆記
  # 資料來源：前端寫死的靜態內容資料（2026-10-27 改為靜態網站，取代 GET /sub-satellites/{id}/paragraphs）

  Background:
    Given 靜態資料中有以下衛星：
      | id | name |
      | 1  | 天文 |
    And 靜態資料中有以下子衛星：
      | id | satellite_id | name |
      | 11 | 1            | 星系 |
      | 12 | 1            | 行星 |
      | 13 | 1            | 彗星 |
    And 靜態資料中有以下段落：
      | id  | sub_satellite_id | title      | summary          | content                        | created_at |
      | 101 | 11               | 銀河系簡介 | 我們所在的星系   | <p>銀河系是一個棒旋星系。</p> | 2026-03-01 |
      | 103 | 11               | 仙女座星系 | 距離最近的大星系 | <p>仙女座星系是螺旋星系。</p> | 2026-03-03 |
      | 102 | 11               | 麥哲倫雲   | null             | <p>麥哲倫雲是矮星系。</p>     | 2026-03-02 |
      | 105 | 12               | 火星筆記   | 紅色星球         | <p>火星有兩顆衛星。</p>       | 2026-03-04 |

  Rule: 後置（回應）- 顯示指定 SubSatellite 下所有 Paragraph，順序與靜態資料中撰寫的順序相同（建立日期 created_at 僅用於顯示，不影響排序）

    Example: 只列出該子衛星的段落，依撰寫順序而非建立日期
      When 讀取子衛星 11 的段落清單
      Then 結果應依序為：
        | title      | summary          | content                        | created_at |
        | 銀河系簡介 | 我們所在的星系   | <p>銀河系是一個棒旋星系。</p> | 2026-03-01 |
        | 仙女座星系 | 距離最近的大星系 | <p>仙女座星系是螺旋星系。</p> | 2026-03-03 |
        | 麥哲倫雲   | null             | <p>麥哲倫雲是矮星系。</p>     | 2026-03-02 |

  Rule: 後置（回應）- 該 SubSatellite 無 Paragraph 時，Modal 顯示空狀態
    # Modal 空狀態的畫面呈現：@frontend，Phase 06 驗證

    Example: 子衛星沒有段落時段落清單為空
      When 讀取子衛星 13 的段落清單
      Then 結果應為空清單

  Rule: 前置（狀態）- 靜態資料中每個 Paragraph 所屬的 SubSatellite 必須存在，否則 build 失敗並指出引用錯誤的 Paragraph

    Example: 所有段落的所屬子衛星都存在時資料檢查通過
      When 檢查靜態資料
      Then 資料檢查應通過

    Example: 段落所屬子衛星不存在時資料檢查失敗
      Given 靜態資料中有以下段落：
        | id  | sub_satellite_id | title    | summary | content           | created_at |
        | 201 | 99               | 土星筆記 | null    | <p>土星有環。</p> | 2026-03-05 |
      When 檢查靜態資料
      Then 資料檢查應失敗，錯誤為「段落「土星筆記」（id 201）的 sub_satellite_id 99 不存在」

  Rule: 前置（參數）- 靜態資料中 Paragraph 的建立日期 created_at 必須為 YYYY-MM-DD 格式，否則 build 失敗

    Example: 建立日期格式錯誤時資料檢查失敗
      Given 靜態資料中有以下段落：
        | id  | sub_satellite_id | title    | summary | content           | created_at |
        | 202 | 12               | 金星筆記 | null    | <p>金星很熱。</p> | 2026/03/05 |
      When 檢查靜態資料
      Then 資料檢查應失敗，錯誤為「段落「金星筆記」（id 202）的 created_at 須為 YYYY-MM-DD」

  Rule: 前置（狀態）- 靜態資料中 Paragraph 的 id 不可重複，否則 build 失敗並指出重複的 id

    Example: 段落 id 重複時資料檢查失敗
      Given 靜態資料中有以下段落：
        | id  | sub_satellite_id | title    | summary | content           | created_at |
        | 101 | 12               | 水星筆記 | null    | <p>水星最小。</p> | 2026-03-06 |
      When 檢查靜態資料
      Then 資料檢查應失敗，錯誤為「段落 id 101 重複」

  Rule: 後置（狀態）- 點擊 SubSatellite 後以 Modal 彈出視窗呈現 Paragraph 清單（含標題、摘要、內容、建立日期）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 無 Paragraph 時 Modal 顯示空狀態
    # @frontend：Phase 06 驗證

  # Paragraph 欄位：id、所屬 SubSatellite（sub_satellite_id）、標題（title）、摘要（summary，可為空）、內容（content，HTML）、建立日期（created_at，YYYY-MM-DD）
