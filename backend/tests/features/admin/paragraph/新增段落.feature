@command
Feature: 新增段落

  Background:
    Given 擁有者已登入
    And 系統中有以下衛星：
      | name | created_at       |
      | 天文 | 2026-01-01 00:00 |
    And 系統中有以下子衛星：
      | satellite_id | name | created_at       |
      | $天文.id     | 星系 | 2026-02-01 00:00 |

  Rule: 前置（身份）- 未帶 JWT 或 JWT 無效／過期（有效期 24 小時）時拒絕操作，回傳 401 Unauthorized

    Scenario Outline: JWT 為「<jwt_state>」時拒絕新增
      Given 擁有者的 JWT 狀態為 "<jwt_state>"
      When 擁有者新增段落：
        | sub_satellite_id | title      | summary        | content                        |
        | $星系.id         | 銀河系簡介 | 我們所在的星系 | <p>銀河系是一個棒旋星系。</p> |
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "UNAUTHORIZED"

      Examples:
        | jwt_state |
        | 未帶      |
        | 已過期    |
        | 無效      |

  Rule: 前置（父層存在）- 目標 SubSatellite 必須存在

    Example: 父層子衛星不存在時拒絕新增
      When 擁有者新增段落：
        | sub_satellite_id | title      | summary        | content                        |
        | 99999            | 銀河系簡介 | 我們所在的星系 | <p>銀河系是一個棒旋星系。</p> |
      Then 操作失敗，狀態碼為 404，錯誤代碼為 "NOT_FOUND"

  Rule: 前置（欄位）- 標題（title）與內容（content）為必填；摘要（summary）為選填；標題長度上限 100 字
  # content 格式：Rich text（WYSIWYG，後端儲存 HTML 或 JSON delta）
  # sub_satellite_id 為 FK，確認為父層關聯欄位，非自由標籤

    Scenario Outline: 欄位不合法時拒絕新增（<case>）
      When 擁有者新增段落：
        | sub_satellite_id | title   | summary        | content   |
        | $星系.id         | <title> | 我們所在的星系 | <content> |
      Then 操作失敗，狀態碼為 400，錯誤代碼為 "<code>"

      Examples:
        | case         | title      | content                        | code                 |
        | 標題為空     | ""         | <p>銀河系是一個棒旋星系。</p> | REQUIRED_FIELD_EMPTY |
        | 內容為空     | 銀河系簡介 | ""                             | REQUIRED_FIELD_EMPTY |
        | 標題 101 字  | 文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文  | <p>銀河系是一個棒旋星系。</p> | FIELD_TOO_LONG       |

    Scenario Outline: 欄位在合法邊界內時可新增（<case>）
      When 擁有者新增段落：
        | sub_satellite_id | title   | summary   | content                        |
        | $星系.id         | <title> | <summary> | <p>銀河系是一個棒旋星系。</p> |
      Then 操作成功
      And 系統中應有以下段落：
        | sub_satellite_id | title   | summary   |
        | $星系.id         | <title> | <summary> |

      Examples:
        | case         | title      | summary        |
        | 標題剛好 100 字 | 文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文文 | 我們所在的星系 |
        | 不填摘要     | 銀河系簡介 | null           |

  Rule: 後置（狀態）- 新增成功後 Paragraph 出現在該 SubSatellite 的清單中

    Example: 新增成功後出現在該子衛星底下
      When 擁有者新增段落：
        | sub_satellite_id | title      | summary        | content                        |
        | $星系.id         | 銀河系簡介 | 我們所在的星系 | <p>銀河系是一個棒旋星系。</p> |
      Then 操作成功
      And 系統中應有以下段落：
        | sub_satellite_id | title      | summary        | content                        |
        | $星系.id         | 銀河系簡介 | 我們所在的星系 | <p>銀河系是一個棒旋星系。</p> |

    Example: 同一子衛星底下標題可重複
      Given 系統中有以下段落：
        | sub_satellite_id | title      | content           | created_at       |
        | $星系.id         | 銀河系簡介 | <p>舊筆記。</p> | 2026-03-01 00:00 |
      When 擁有者新增段落：
        | sub_satellite_id | title      | summary        | content                        |
        | $星系.id         | 銀河系簡介 | 我們所在的星系 | <p>銀河系是一個棒旋星系。</p> |
      Then 操作成功

  Rule: 後置（錯誤）- 目標 SubSatellite 不存在時回傳 404 Not Found
    # 由「前置（父層存在）」的 Examples 覆蓋

  Rule: 後置（錯誤）- 必填欄位為空時拒絕建立，回傳 400 Bad Request
    # 由「前置（欄位）」的 Examples 覆蓋

  Rule: 後置（錯誤）- 標題超過 100 字時拒絕，回傳 400 Bad Request
    # 由「前置（欄位）」的 Examples 覆蓋
