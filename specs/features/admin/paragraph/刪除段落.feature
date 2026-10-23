@ignore @command
Feature: 刪除段落

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 Paragraph

  Rule: 前置（確認）- 刪除前必須顯示確認對話框，使用者主動確認後才執行刪除

  Rule: 前置（存在）- 目標 Paragraph 必須存在

  Rule: 後置（狀態）- 刪除成功後 Paragraph 從清單消失

  Rule: 後置（錯誤）- 目標 Paragraph 不存在時回傳 404 Not Found
  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
