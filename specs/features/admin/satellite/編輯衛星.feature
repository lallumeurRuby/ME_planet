@ignore @command
Feature: 編輯衛星

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 Satellite

  Rule: 前置（身份）- 未帶 JWT 或 JWT 無效／過期（有效期 24 小時）時拒絕操作，回傳 401 Unauthorized

  Rule: 前置（存在）- 目標 Satellite 必須存在

  Rule: 前置（欄位）- 名稱（name）為必填，不可為空，長度上限 50 字

  Rule: 前置（唯一）- Satellite 名稱（name）全域唯一

  Rule: 後置（狀態）- 編輯成功後 Satellite 資料更新

  Rule: 後置（錯誤）- 必填欄位為空時拒絕更新，回傳 400 Bad Request

  Rule: 後置（錯誤）- 目標 Satellite 不存在時回傳 404 Not Found

  Rule: 後置（錯誤）- 名稱重複時拒絕，回傳 409 Conflict

  Rule: 後置（錯誤）- 名稱超過 50 字時拒絕，回傳 400 Bad Request

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
