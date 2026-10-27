@query
Feature: 探索衛星
  # 資料來源：前端寫死的靜態內容資料（2026-10-27 改為靜態網站，取代 GET /satellites/{id}/sub-satellites）

  Background:
    Given 靜態資料中有以下衛星：
      | id | name     |
      | 1  | 天文     |
      | 2  | 程式設計 |
      | 3  | 音樂     |
    And 靜態資料中有以下子衛星：
      | id | satellite_id | name   |
      | 12 | 1            | 行星   |
      | 11 | 1            | 星系   |
      | 14 | 1            | 黑洞   |
      | 21 | 2            | 演算法 |

  Rule: 後置（回應）- 顯示指定 Satellite 下所有 SubSatellite，順序與靜態資料中撰寫的順序相同

    Example: 只列出該衛星的子衛星，依撰寫順序
      When 讀取衛星 1 的子衛星清單
      Then 結果應依序為：
        | satellite_id | name |
        | 1            | 行星 |
        | 1            | 星系 |
        | 1            | 黑洞 |

  Rule: 後置（回應）- 該 Satellite 無 SubSatellite 時，相機飛入後周圍不顯示任何 SubSatellite
    # 飛入後的畫面呈現：@frontend，Phase 06 驗證

    Example: 衛星沒有子衛星時子衛星清單為空
      When 讀取衛星 3 的子衛星清單
      Then 結果應為空清單

  Rule: 前置（狀態）- 靜態資料中每個 SubSatellite 所屬的 Satellite 必須存在，否則 build 失敗並指出引用錯誤的 SubSatellite

    Example: 所有子衛星的所屬衛星都存在時資料檢查通過
      When 檢查靜態資料
      Then 資料檢查應通過

    Example: 子衛星所屬衛星不存在時資料檢查失敗
      Given 靜態資料中有以下子衛星：
        | id | satellite_id | name |
        | 31 | 99           | 爵士 |
      When 檢查靜態資料
      Then 資料檢查應失敗，錯誤為「子衛星「爵士」（id 31）的 satellite_id 99 不存在」

  Rule: 前置（狀態）- 靜態資料中 SubSatellite 的 id 不可重複，否則 build 失敗並指出重複的 id

    Example: 子衛星 id 重複時資料檢查失敗
      Given 靜態資料中有以下子衛星：
        | id | satellite_id | name |
        | 11 | 2            | 資料結構 |
      When 檢查靜態資料
      Then 資料檢查應失敗，錯誤為「子衛星 id 11 重複」

  Rule: 後置（狀態）- 點擊 Satellite 後相機飛入該 Satellite 近景
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 相機飛入後，該 Satellite 的 SubSatellite 環繞在周圍顯示
    # @frontend：Phase 06 驗證

  # SubSatellite 欄位：id、所屬 Satellite（satellite_id）、名稱（name）
