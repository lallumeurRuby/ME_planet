@command
Feature: 編輯ME星球內容
  # 原文：「ME planet 也可以點擊跳出彈窗，內容一樣可以在後台設定」
  # ME Planet 只有單一一份內容，後台只能編輯，不能新增或刪除（澄清 2026-10-27 Q1）

  Background:
    Given 擁有者已登入

  Rule: 前置（身份）- 未帶 JWT 或 JWT 無效／過期（有效期 24 小時）時拒絕操作，回傳 401 Unauthorized

    Scenario Outline: JWT 為「<jwt_state>」時拒絕編輯
      Given 擁有者的 JWT 狀態為 "<jwt_state>"
      When 擁有者編輯ME星球內容：
        | content                                  |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> |
      Then 操作失敗，狀態碼為 401，錯誤代碼為 "UNAUTHORIZED"

      Examples:
        | jwt_state |
        | 未帶      |
        | 已過期    |
        | 無效      |

  Rule: 前置（欄位）- 只有內容（content）一個欄位，格式為 rich text（WYSIWYG），無標題
    # 由「後置（狀態）」的 Examples 覆蓋（HTML 內容原樣儲存）

  Rule: 前置（欄位）- 內容（content）為選填，允許送空白；送空白即清空 ME Planet 內容（前台 Modal 顯示空狀態）
    # 送 "" 或 null 一律存為 null；WYSIWYG 空編輯器由前端轉為 "" 再送出

    Scenario Outline: 內容送<case>時清空 ME Planet 內容
      Given ME星球內容為：
        | content            | updated_at       |
        | <p>舊的自我介紹</p> | 2026-01-01 00:00 |
      When 擁有者編輯ME星球內容：
        | content   |
        | <content> |
      Then 操作成功
      And ME星球內容應為：
        | content | updated_at |
        | null    | now        |

      Examples:
        | case   | content |
        | 空字串 | ""      |
        | null   | null    |

  Rule: 後置（狀態）- 編輯成功後 ME Planet 內容更新，更新日期（updated_at）同步更新

    Example: 已有內容時覆蓋為新內容，仍只有一筆
      Given ME星球內容為：
        | content            | updated_at       |
        | <p>舊的自我介紹</p> | 2026-01-01 00:00 |
      When 擁有者編輯ME星球內容：
        | content                                  |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> |
      Then 操作成功
      And ME星球內容應為：
        | content                                  | updated_at |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> | now        |

  Rule: 後置（狀態）- 從未設定過內容時，第一次編輯即建立該份內容（整份覆蓋，不回 404）

    Example: 從未設定內容時首次編輯即建立
      When 擁有者編輯ME星球內容：
        | content                                  |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> |
      Then 操作成功
      And ME星球內容應為：
        | content                                  | updated_at |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> | now        |
