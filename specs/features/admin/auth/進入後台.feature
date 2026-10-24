@command
Feature: 進入後台管理介面

  Background:
    Given 擁有者憑證為：
      | password   | failed_attempts | locked_until |
      | Orbit#2026 | 0               | null         |

  Rule: 前置（身份）- 只有擁有者可以進入後台（密碼登入 + JWT）
    # @frontend：Phase 06 驗證（UI 面向）；後端面由以下 Rule 覆蓋

  Rule: 前置（參數）- 密碼為必填，未提供時回傳 400 Bad Request

    Example: 密碼為空時拒絕登入
      When 擁有者登入後台：
        | password |
        | ""       |
      Then 操作失敗，狀態碼為 400，錯誤代碼為 "REQUIRED_FIELD_EMPTY"

  Rule: 前置（鎖定）- 連續密碼錯誤 5 次後鎖定 15 分鐘，鎖定期間一律回傳 429 Too Many Requests

    Example: 第 5 次密碼錯誤時觸發鎖定
      Given 擁有者憑證為：
        | password   | failed_attempts | locked_until |
        | Orbit#2026 | 4               | null         |
      When 擁有者登入後台：
        | password   |
        | WrongPass1 |
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "INVALID_PASSWORD"
      And 擁有者憑證應為：
        | failed_attempts | locked_until |
        | 5               | now+15m      |

    Scenario Outline: 鎖定期間不論密碼正確與否一律拒絕
      Given 擁有者憑證為：
        | password   | failed_attempts | locked_until |
        | Orbit#2026 | 5               | now+10m      |
      When 擁有者登入後台：
        | password   |
        | <password> |
      Then 操作失敗，狀態碼為 429，錯誤代碼為 "LOGIN_LOCKED"

      Examples:
        | password   |
        | Orbit#2026 |
        | WrongPass1 |

    Example: 鎖定到期後可用正確密碼登入
      Given 擁有者憑證為：
        | password   | failed_attempts | locked_until |
        | Orbit#2026 | 5               | now-1m       |
      When 擁有者登入後台：
        | password   |
        | Orbit#2026 |
      Then 操作成功
      And 擁有者憑證應為：
        | failed_attempts | locked_until |
        | 0               | null         |

    Example: 鎖定到期後錯誤計數從 0 重新起算
      Given 擁有者憑證為：
        | password   | failed_attempts | locked_until |
        | Orbit#2026 | 5               | now-1m       |
      When 擁有者登入後台：
        | password   |
        | WrongPass1 |
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "INVALID_PASSWORD"
      And 擁有者憑證應為：
        | failed_attempts | locked_until |
        | 1               | null         |

  Rule: 後置（狀態）- 密碼正確後發放 JWT（有效期 24 小時），可看到後台管理介面
    # 「可看到後台管理介面」@frontend：Phase 06 驗證

    Example: 密碼正確時發放 24 小時 JWT
      When 擁有者登入後台：
        | password   |
        | Orbit#2026 |
      Then 操作成功
      And 回應應包含有效期 24 小時的 JWT
      And 擁有者憑證應為：
        | failed_attempts | locked_until |
        | 0               | null         |

  Rule: 後置（狀態）- 登入成功後連續錯誤次數歸零

    Example: 有錯誤紀錄時登入成功後歸零
      Given 擁有者憑證為：
        | password   | failed_attempts | locked_until |
        | Orbit#2026 | 3               | null         |
      When 擁有者登入後台：
        | password   |
        | Orbit#2026 |
      Then 操作成功
      And 擁有者憑證應為：
        | failed_attempts | locked_until |
        | 0               | null         |

  Rule: 後置（錯誤）- 密碼錯誤時拒絕進入，回傳 401 Unauthorized

    Example: 密碼錯誤時拒絕並累計錯誤次數
      When 擁有者登入後台：
        | password   |
        | WrongPass1 |
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "INVALID_PASSWORD"
      And 擁有者憑證應為：
        | failed_attempts | locked_until |
        | 1               | null         |
