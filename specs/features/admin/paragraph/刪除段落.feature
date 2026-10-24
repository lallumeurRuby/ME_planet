@command
Feature: 刪除段落

  Background:
    Given 擁有者已登入
    And 系統中有以下衛星：
      | name | created_at       |
      | 天文 | 2026-01-01 00:00 |
    And 系統中有以下子衛星：
      | satellite_id | name | created_at       |
      | $天文.id     | 星系 | 2026-02-01 00:00 |
    And 系統中有以下段落：
      | sub_satellite_id | title      | content                        | created_at       |
      | $星系.id         | 銀河系簡介 | <p>銀河系是一個棒旋星系。</p> | 2026-03-01 00:00 |
      | $星系.id         | 太陽系簡介 | <p>太陽系有八大行星。</p>     | 2026-03-02 00:00 |

  Rule: 前置（身份）- 未帶 JWT 或 JWT 無效／過期（有效期 24 小時）時拒絕操作，回傳 401 Unauthorized

    Scenario Outline: JWT 為「<jwt_state>」時拒絕刪除
      Given 擁有者的 JWT 狀態為 "<jwt_state>"
      When 擁有者刪除段落 "$太陽系簡介.id"
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "UNAUTHORIZED"

      Examples:
        | jwt_state |
        | 未帶      |
        | 已過期    |
        | 無效      |

  Rule: 前置（確認）- 刪除前必須顯示確認對話框，使用者主動確認後才執行刪除
    # @frontend：Phase 06 驗證

  Rule: 前置（存在）- 目標 Paragraph 必須存在

    Example: 目標段落不存在時拒絕刪除
      When 擁有者刪除段落 "99999"
      Then 操作失敗，狀態碼為 404，錯誤代碼為 "NOT_FOUND"

  Rule: 後置（狀態）- 刪除成功後 Paragraph 從清單消失

    Example: 刪除成功後消失，同一子衛星的其他段落不受影響
      When 擁有者刪除段落 "$太陽系簡介.id"
      Then 操作成功
      And 系統中不應有段落 "太陽系簡介"
      And 系統中應有以下段落：
        | sub_satellite_id | title      |
        | $星系.id         | 銀河系簡介 |

  Rule: 後置（錯誤）- 目標 Paragraph 不存在時回傳 404 Not Found
    # 由「前置（存在）」的 Examples 覆蓋
