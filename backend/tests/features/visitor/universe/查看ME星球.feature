@query
Feature: 查看ME星球
  # 公開讀取 API（不需 JWT），前台訪客與後台擁有者共用
  # 原文：「ME planet 也可以點擊跳出彈窗，內容一樣可以在後台設定」
  # ME Planet 只有單一一份內容，僅含 content（rich text），無標題（澄清 2026-10-27 Q1）

  Rule: 後置（回應）- 回傳 ME Planet 的單一內容（content、updated_at）

    Example: 已設定內容時回傳該內容
      Given ME星球內容為：
        | content                                  | updated_at       |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> | 2026-03-01 00:00 |
      When 查詢ME星球內容
      Then 操作成功
      And 查詢結果應為：
        | content                                  | updated_at       |
        | <p>我是 Ruby，喜歡天文與程式設計。</p> | 2026-03-01 00:00 |

  Rule: 後置（回應）- 尚未設定或已清空 ME Planet 內容時回傳空內容
    # 回 200，content 為 null（不回 404）

    Example: 從未設定內容時回傳空內容
      When 查詢ME星球內容
      Then 操作成功
      And 查詢結果應為：
        | content | updated_at |
        | null    | null       |

    Example: 已清空內容時回傳空內容，更新日期保留
      Given ME星球內容為：
        | content | updated_at       |
        | null    | 2026-03-01 00:00 |
      When 查詢ME星球內容
      Then 操作成功
      And 查詢結果應為：
        | content | updated_at       |
        | null    | 2026-03-01 00:00 |

  Rule: 後置（狀態）- 點擊 ME Planet 後相機不移動，直接以 Modal 彈出視窗呈現 ME Planet 內容
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 無 ME Planet 內容時 Modal 顯示空狀態
    # @frontend：Phase 06 驗證

  # MePlanetContent 欄位：內容（content，rich text，可為 null）、更新日期（updated_at）
