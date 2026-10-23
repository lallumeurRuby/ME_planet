@ignore @command
Feature: 編輯衛星

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 Satellite

  Rule: 前置（存在）- 目標 Satellite 必須存在

  Rule: 前置（欄位）- 名稱（name）為必填，不可為空

  Rule: 後置（狀態）- 編輯成功後 Satellite 資料更新

  Rule: 後置（錯誤）- 目標 Satellite 不存在時回傳 404 Not Found

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
