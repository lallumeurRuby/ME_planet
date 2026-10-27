@query
Feature: 瀏覽3D宇宙初始畫面
  # 資料來源：前端寫死的靜態內容資料（2026-10-27 改為靜態網站，取代 GET /satellites）

  Rule: 後置（回應）- 場景顯示靜態資料中的所有 Satellite，順序與靜態資料中撰寫的順序相同

    Example: 依靜態資料撰寫的順序列出所有衛星
      Given 靜態資料中有以下衛星：
        | id | name     |
        | 2  | 程式設計 |
        | 1  | 天文     |
        | 3  | 音樂     |
      When 讀取衛星清單
      Then 結果應依序為：
        | name     |
        | 程式設計 |
        | 天文     |
        | 音樂     |

  Rule: 後置（回應）- 靜態資料中無任何 Satellite 時，場景只顯示 ME Planet
    # 「只顯示 ME Planet」的畫面呈現：@frontend，Phase 06 驗證

    Example: 沒有衛星時衛星清單為空
      When 讀取衛星清單
      Then 結果應為空清單

  Rule: 前置（狀態）- 靜態資料中 Satellite 的 id 不可重複，否則 build 失敗並指出重複的 id

    Example: 衛星 id 重複時資料檢查失敗
      Given 靜態資料中有以下衛星：
        | id | name |
        | 1  | 天文 |
        | 1  | 音樂 |
      When 檢查靜態資料
      Then 資料檢查應失敗，錯誤為「衛星 id 1 重複」

  Rule: 後置（回應）- 進入網站後可載入 3D 宇宙場景（ME Planet + 所有 Satellite 環繞）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 場景載入完成後自動慢速旋轉（idle 動畫）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 場景顯示所有 Satellite
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- WebGL 不支援時顯示 fallback 畫面
    # @frontend：Phase 06 驗證

  # Satellite 欄位：id、名稱（name）
