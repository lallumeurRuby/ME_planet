@query
Feature: 查看ME星球
  # 資料來源：前端寫死的靜態內容資料（2026-10-27 改為靜態網站，取代 GET /me-planet）
  # ME Planet 只有單一一份內容，僅含 content（rich text），無標題（澄清 2026-10-27 Q1）

  Rule: 後置（回應）- 顯示靜態資料中 ME Planet 的單一內容（content）

    Example: 已撰寫內容時回傳該內容
      Given ME星球內容為：
        | content                                |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> |
      When 讀取ME星球內容
      Then 結果應為：
        | content                                |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> |

  Rule: 後置（回應）- 靜態資料中 ME Planet 內容留空時，視為空內容（不區分「從未設定」與「已清空」）

    Example: 內容為 null 時視為空內容
      Given ME星球內容為：
        | content |
        | null    |
      When 讀取ME星球內容
      Then ME星球內容應為空

    Example: 內容為空字串時視為空內容
      Given ME星球內容為：
        | content |
        |         |
      When 讀取ME星球內容
      Then ME星球內容應為空

  Rule: 後置（狀態）- 點擊 ME Planet 後相機不移動，直接以 Modal 彈出視窗呈現 ME Planet 內容
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 無 ME Planet 內容時 Modal 顯示空狀態
    # @frontend：Phase 06 驗證

  # MePlanetContent 欄位：內容（content，rich text，可為空）
