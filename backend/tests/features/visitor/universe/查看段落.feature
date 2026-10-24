@query
Feature: 查看段落筆記
  # 公開讀取 API（不需 JWT），前台訪客與後台擁有者共用（取代原 admin/paragraph/列出段落.feature）

  Background:
    Given 系統中有以下衛星：
      | name | created_at       |
      | 天文 | 2026-01-01 00:00 |
    And 系統中有以下子衛星：
      | satellite_id | name | created_at       |
      | $天文.id     | 星系 | 2026-02-01 00:00 |
      | $天文.id     | 行星 | 2026-02-02 00:00 |
      | $天文.id     | 彗星 | 2026-02-03 00:00 |
    And 系統中有以下段落：
      | sub_satellite_id | title      | summary          | content                        | created_at       |
      | $星系.id         | 銀河系簡介 | 我們所在的星系   | <p>銀河系是一個棒旋星系。</p> | 2026-03-01 00:00 |
      | $星系.id         | 仙女座星系 | 距離最近的大星系 | <p>仙女座星系是螺旋星系。</p> | 2026-03-03 00:00 |
      | $星系.id         | 麥哲倫雲   | null             | <p>麥哲倫雲是矮星系。</p>     | 2026-03-02 00:00 |
      | $行星.id         | 火星筆記   | 紅色星球         | <p>火星有兩顆衛星。</p>       | 2026-03-04 00:00 |

  Rule: 後置（回應）- 回傳指定 SubSatellite 下所有 Paragraph 的清單，依建立時間由新到舊排序

    Example: 只列出該子衛星的段落，依建立時間由新到舊
      When 查詢子衛星 "$星系.id" 的段落清單
      Then 操作成功
      And 查詢結果應依序為：
        | title      | summary          | content                        | created_at       |
        | 仙女座星系 | 距離最近的大星系 | <p>仙女座星系是螺旋星系。</p> | 2026-03-03 00:00 |
        | 麥哲倫雲   | null             | <p>麥哲倫雲是矮星系。</p>     | 2026-03-02 00:00 |
        | 銀河系簡介 | 我們所在的星系   | <p>銀河系是一個棒旋星系。</p> | 2026-03-01 00:00 |

  Rule: 後置（回應）- 該 SubSatellite 無 Paragraph 時回傳空陣列

    Example: 子衛星沒有段落時回傳空清單
      When 查詢子衛星 "$彗星.id" 的段落清單
      Then 操作成功
      And 查詢結果應為空清單

  Rule: 後置（錯誤）- 指定 SubSatellite 不存在時回傳 404 Not Found

    Example: 子衛星不存在時回傳 404
      When 查詢子衛星 "99999" 的段落清單
      Then 操作失敗，狀態碼為 404，錯誤代碼為 "NOT_FOUND"

  Rule: 後置（狀態）- 點擊 SubSatellite 後以 Modal 彈出視窗呈現 Paragraph 清單（含標題、摘要、內容、建立日期）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 無 Paragraph 時 Modal 顯示空狀態
    # @frontend：Phase 06 驗證
    # TODO(Phase-06): 空狀態的具體 UI 文字由 Frontend Build 決定

  # Paragraph 欄位：標題（title）、摘要（summary）、內容（content）、建立日期（created_at）、更新日期（updated_at）、sub_satellite_id（FK）
