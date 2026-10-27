@command
Feature: 刪除衛星

  Background:
    Given 擁有者已登入
    And 系統中有以下衛星：
      | name     | created_at       |
      | 天文     | 2026-01-01 00:00 |
      | 程式設計 | 2026-01-02 00:00 |
    And 系統中有以下子衛星：
      | satellite_id | name | created_at       |
      | $天文.id     | 星系 | 2026-02-01 00:00 |

  Rule: 前置（身份）- 未帶 JWT 或 JWT 無效／過期（有效期 24 小時）時拒絕操作，回傳 401 Unauthorized

    Scenario Outline: JWT 為「<jwt_state>」時拒絕刪除
      Given 擁有者的 JWT 狀態為 "<jwt_state>"
      When 擁有者刪除衛星 "$程式設計.id"
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "UNAUTHORIZED"

      Examples:
        | jwt_state |
        | 未帶      |
        | 已過期    |
        | 無效      |

  Rule: 前置（確認）- 刪除前必須顯示確認對話框，並以固定警告文字提示「底下所有子衛星與段落將一併刪除，無法復原」，使用者主動確認後才執行刪除
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 刪除成功後 Satellite 從清單消失

    Example: 刪除沒有子衛星的衛星
      When 擁有者刪除衛星 "$程式設計.id"
      Then 操作成功
      And 系統中不應有衛星 "程式設計"

  Rule: 後置（狀態）- 衛星底下仍有 SubSatellite 時也可刪除，所屬 SubSatellite 與其 Paragraph 一併刪除
    # 原文：「不需要下層內容為空才能刪除，只要確認彈窗按下確認即可刪除」（取代原「前置（護欄）」409 HAS_CHILDREN）
    # 澄清 2026-10-27 Q2：一併刪除（cascade）
    # Example 待 Phase 03 BDD Analysis 補齊

  Rule: 後置（錯誤）- 目標 Satellite 不存在時回傳 404 Not Found

    Example: 目標衛星不存在時拒絕刪除
      When 擁有者刪除衛星 "99999"
      Then 操作失敗，狀態碼為 404，錯誤代碼為 "NOT_FOUND"

