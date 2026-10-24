@command
Feature: 編輯段落

  Background:
    Given 擁有者已登入
    And 系統中有以下衛星：
      | name | created_at       |
      | 天文 | 2026-01-01 00:00 |
    And 系統中有以下子衛星：
      | satellite_id | name | created_at       |
      | $天文.id     | 星系 | 2026-02-01 00:00 |
    And 系統中有以下段落：
      | sub_satellite_id | title      | summary | content         | created_at       | updated_at       |
      | $星系.id         | 銀河系簡介 | 舊摘要  | <p>舊內容</p> | 2026-01-01 00:00 | 2026-01-01 00:00 |

  Rule: 前置（身份）- 未帶 JWT 或 JWT 無效／過期（有效期 24 小時）時拒絕操作，回傳 401 Unauthorized

    Scenario Outline: JWT 為「<jwt_state>」時拒絕編輯
      Given 擁有者的 JWT 狀態為 "<jwt_state>"
      When 擁有者編輯段落：
        | paragraph_id   | title      | summary | content                        |
        | $銀河系簡介.id | 銀河系導覽 | 新摘要  | <p>銀河系是一個棒旋星系。</p> |
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "UNAUTHORIZED"

      Examples:
        | jwt_state |
        | 未帶      |
        | 已過期    |
        | 無效      |

  Rule: 前置（存在）- 目標 Paragraph 必須存在

    Example: 目標段落不存在時拒絕編輯
      When 擁有者編輯段落：
        | paragraph_id | title      | summary | content                        |
        | 99999        | 銀河系導覽 | 新摘要  | <p>銀河系是一個棒旋星系。</p> |
      Then 操作失敗，狀態碼為 404，錯誤代碼為 "NOT_FOUND"

  Rule: 前置（欄位）- 標題（title）與內容（content）為必填，不可為空；摘要（summary）為選填；標題長度上限 100 字
  # content 格式：Rich text（WYSIWYG）

    Scenario Outline: 欄位不合法時拒絕編輯（<case>）
      When 擁有者編輯段落：
        | paragraph_id   | title   | summary | content   |
        | $銀河系簡介.id | <title> | 新摘要  | <content> |
      Then 操作失敗，狀態碼為 400，錯誤代碼為 "<code>"

      Examples:
        | case        | title      | content                        | code                 |
        | 標題為空    | ""         | <p>銀河系是一個棒旋星系。</p> | REQUIRED_FIELD_EMPTY |
        | 內容為空    | 銀河系導覽 | ""                             | REQUIRED_FIELD_EMPTY |
        | 標題 101 字 | 文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文  | <p>銀河系是一個棒旋星系。</p> | FIELD_TOO_LONG       |

    Scenario Outline: 欄位在合法邊界內時可編輯（<case>）
      When 擁有者編輯段落：
        | paragraph_id   | title   | summary   | content                        |
        | $銀河系簡介.id | <title> | <summary> | <p>銀河系是一個棒旋星系。</p> |
      Then 操作成功
      And 系統中應有以下段落：
        | id             | title   | summary   |
        | $銀河系簡介.id | <title> | <summary> |

      Examples:
        | case               | title      | summary |
        | 標題剛好 100 字    | 文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文  | 新摘要  |
        | 摘要送 null 即清空 | 銀河系導覽 | null    |

  Rule: 後置（狀態）- 編輯成功後 Paragraph 內容更新，更新日期（updated_at）同步更新

    Example: 編輯成功後內容與 updated_at 更新、created_at 不變
      When 擁有者編輯段落：
        | paragraph_id   | title      | summary | content                        |
        | $銀河系簡介.id | 銀河系導覽 | 新摘要  | <p>銀河系是一個棒旋星系。</p> |
      Then 操作成功
      And 系統中應有以下段落：
        | id             | title      | summary | content                        | created_at       | updated_at |
        | $銀河系簡介.id | 銀河系導覽 | 新摘要  | <p>銀河系是一個棒旋星系。</p> | 2026-01-01 00:00 | now        |

  Rule: 後置（錯誤）- 必填欄位為空時拒絕更新，回傳 400 Bad Request
    # 由「前置（欄位）」的 Examples 覆蓋

  Rule: 後置（錯誤）- 目標 Paragraph 不存在時回傳 404 Not Found
    # 由「前置（存在）」的 Examples 覆蓋

  Rule: 後置（錯誤）- 標題超過 100 字時拒絕，回傳 400 Bad Request
    # 由「前置（欄位）」的 Examples 覆蓋
