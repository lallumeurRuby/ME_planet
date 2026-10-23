@ignore @command
Feature: 編輯段落

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 Paragraph

  Rule: 前置（存在）- 目標 Paragraph 必須存在

  Rule: 前置（欄位）- 標題（title）與內容（content）為必填，不可為空；摘要（summary）為選填
  # content 格式：Rich text（WYSIWYG）

  Rule: 後置（狀態）- 編輯成功後 Paragraph 內容更新

  Rule: 後置（錯誤）- 目標 Paragraph 不存在時回傳 404 Not Found

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
