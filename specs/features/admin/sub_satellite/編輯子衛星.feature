@command
Feature: 編輯子衛星

  Background:
    Given 擁有者已登入
    And 系統中有以下衛星：
      | name     | created_at       |
      | 天文     | 2026-01-01 00:00 |
      | 程式設計 | 2026-01-02 00:00 |
    And 系統中有以下子衛星：
      | satellite_id | name   | created_at       |
      | $天文.id     | 星系   | 2026-02-01 00:00 |
      | $天文.id     | 行星   | 2026-02-02 00:00 |
      | $程式設計.id | 演算法 | 2026-02-01 00:00 |

  Rule: 前置（身份）- 未帶 JWT 或 JWT 無效／過期（有效期 24 小時）時拒絕操作，回傳 401 Unauthorized

    Scenario Outline: JWT 為「<jwt_state>」時拒絕編輯
      Given 擁有者的 JWT 狀態為 "<jwt_state>"
      When 擁有者編輯子衛星：
        | sub_satellite_id | name |
        | $星系.id         | 星雲 |
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "UNAUTHORIZED"

      Examples:
        | jwt_state |
        | 未帶      |
        | 已過期    |
        | 無效      |

  Rule: 前置（存在）- 目標 SubSatellite 必須存在

    Example: 目標子衛星不存在時拒絕編輯
      When 擁有者編輯子衛星：
        | sub_satellite_id | name |
        | 99999            | 星雲 |
      Then 操作失敗，狀態碼為 404，錯誤代碼為 "NOT_FOUND"

  Rule: 前置（欄位）- 名稱（name）為必填，不可為空，長度上限 50 字

    Scenario Outline: 名稱不合法時拒絕編輯（<case>）
      When 擁有者編輯子衛星：
        | sub_satellite_id | name   |
        | $星系.id         | <name> |
      Then 操作失敗，狀態碼為 400，錯誤代碼為 "<code>"

      Examples:
        | case    | name     | code                 |
        | 名稱為空 | ""       | REQUIRED_FIELD_EMPTY |
        | 51 字   | 星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星 | FIELD_TOO_LONG       |

    Example: 名稱剛好 50 字時可編輯
      When 擁有者編輯子衛星：
        | sub_satellite_id | name     |
        | $星系.id         | 星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星 |
      Then 操作成功
      And 系統中應有以下子衛星：
        | id       | satellite_id | name     |
        | $星系.id | $天文.id     | 星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星星 |

  Rule: 前置（唯一）- SubSatellite 名稱（name）在同一 Satellite 內唯一

    Example: 與同一衛星內的子衛星重名時拒絕編輯
      When 擁有者編輯子衛星：
        | sub_satellite_id | name |
        | $星系.id         | 行星 |
      Then 操作失敗，狀態碼為 409，錯誤代碼為 "NAME_DUPLICATED"

    Scenario Outline: 不構成同衛星內重名時可編輯（<case>）
      When 擁有者編輯子衛星：
        | sub_satellite_id | name   |
        | $星系.id         | <name> |
      Then 操作成功

      Examples:
        | case                       | name   |
        | 與其他衛星底下的子衛星同名 | 演算法 |
        | 改成自己現有的名稱         | 星系   |

  Rule: 後置（狀態）- 編輯成功後 SubSatellite 資料更新

    Example: 編輯成功後名稱更新、所屬衛星不變
      When 擁有者編輯子衛星：
        | sub_satellite_id | name |
        | $星系.id         | 星雲 |
      Then 操作成功
      And 系統中應有以下子衛星：
        | id       | satellite_id | name |
        | $星系.id | $天文.id     | 星雲 |

  Rule: 後置（錯誤）- 必填欄位為空時拒絕更新，回傳 400 Bad Request
    # 由「前置（欄位）」的 Examples 覆蓋

  Rule: 後置（錯誤）- 目標 SubSatellite 不存在時回傳 404 Not Found
    # 由「前置（存在）」的 Examples 覆蓋

  Rule: 後置（錯誤）- 名稱重複時拒絕，回傳 409 Conflict
    # 由「前置（唯一）」的 Examples 覆蓋

  Rule: 後置（錯誤）- 名稱超過 50 字時拒絕，回傳 400 Bad Request
    # 由「前置（欄位）」的 Examples 覆蓋
