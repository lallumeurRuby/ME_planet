@query
Feature: 探索衛星
  # 公開讀取 API（不需 JWT），前台訪客與後台擁有者共用（取代原 admin/sub_satellite/列出子衛星.feature）

  Background:
    Given 系統中有以下衛星：
      | name     | created_at       |
      | 天文     | 2026-01-01 00:00 |
      | 程式設計 | 2026-01-02 00:00 |
      | 音樂     | 2026-01-03 00:00 |
    And 系統中有以下子衛星：
      | satellite_id | name   | created_at       |
      | $天文.id     | 行星   | 2026-02-02 00:00 |
      | $天文.id     | 星系   | 2026-02-01 00:00 |
      | $天文.id     | 黑洞   | 2026-02-03 00:00 |
      | $程式設計.id | 演算法 | 2026-02-01 00:00 |

  Rule: 後置（回應）- 回傳指定 Satellite 下所有 SubSatellite 的清單，依建立時間由舊到新排序

    Example: 只列出該衛星的子衛星，依建立時間由舊到新
      When 查詢衛星 "$天文.id" 的子衛星清單
      Then 操作成功
      And 查詢結果應依序為：
        | satellite_id | name |
        | $天文.id     | 星系 |
        | $天文.id     | 行星 |
        | $天文.id     | 黑洞 |

  Rule: 後置（回應）- 該 Satellite 無 SubSatellite 時回傳空陣列

    Example: 衛星沒有子衛星時回傳空清單
      When 查詢衛星 "$音樂.id" 的子衛星清單
      Then 操作成功
      And 查詢結果應為空清單

  Rule: 後置（錯誤）- 指定 Satellite 不存在時回傳 404 Not Found

    Example: 衛星不存在時回傳 404
      When 查詢衛星 "99999" 的子衛星清單
      Then 操作失敗，狀態碼為 404，錯誤代碼為 "NOT_FOUND"

  Rule: 後置（狀態）- 點擊 Satellite 後相機飛入該 Satellite 近景
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 相機飛入後，該 Satellite 的 SubSatellite 環繞在周圍顯示
    # @frontend：Phase 06 驗證

  # SubSatellite 欄位：名稱（name）、satellite_id（FK）
